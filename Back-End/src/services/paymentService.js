import db from '../models/index';
import { ignoreLogger, VNPay } from 'vnpay';
import crypto from 'crypto';
import moment from 'moment';

// Thông tin cấu hình VNPay
const vnpConfig = {
  tmnCode: "18ROR1Z7", // Mã website tại VNPay
  secureSecret: "HST957DH47R22A0YSZRECCRN4WF6YSQE", // Chuỗi bí mật
  vnpUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", // URL thanh toán VNPay
  returnUrl: "http://localhost:8080/api/v1/payment/vnpay-return" // URL callback
};

// Khởi tạo đối tượng VNPay từ thư viện
const vnpay = new VNPay({
  tmnCode: vnpConfig.tmnCode,
  secureSecret: vnpConfig.secureSecret,
  vnpUrl: vnpConfig.vnpUrl,
  returnUrl: vnpConfig.returnUrl,
  testMode: true,
  hashAlgorithm: 'SHA512',
  logger: ignoreLogger,
});

const paymentService = {
  // Tạo URL thanh toán VNPay
  createPaymentUrl: async (bookingId, ipAddr) => {
    try {
      // Kiểm tra booking có tồn tại không
      const booking = await db.FactBooking.findByPk(bookingId, {
        include: [
          {
            model: db.FactBookingDetail,
            required: true,
            include: [
              {
                model: db.Room
              },
              {
                model: db.FactBookingDetailAmenities,
                include: [
                  {
                    model: db.Amenities
                  }
                ]
              }
            ]
          },
          {
            model: db.Payment,
            required: false
          }
        ]
      });

      if (!booking) {
        return {
          EM: 'Không tìm thấy đơn đặt phòng',
          EC: 1,
          DT: []
        };
      }

      // Kiểm tra nếu đã có thanh toán thành công
      if (booking.Payment && booking.Payment.statusPayment === 'Paid') {
        return {
          EM: 'Đơn đặt phòng này đã được thanh toán',
          EC: 1,
          DT: []
        };
      }

      // Tính tổng số tiền từ các chi tiết đặt phòng
      let totalAmount = 0;
      console.log('Chi tiết các khoản thanh toán:');
      
      booking.FactBookingDetails.forEach((detail, index) => {
        const detailAmount = parseFloat(detail.totalAmount || 0);
        let totalAmenities = 0;
        
        // Tính tổng tiền tiện ích cho phòng này
        if (detail.FactBookingDetailAmenities && detail.FactBookingDetailAmenities.length > 0) {
          totalAmenities = detail.FactBookingDetailAmenities.reduce((sum, amenity) => {
            return sum + (parseFloat(amenity.price || 0) * parseFloat(amenity.quantity || 0));
          }, 0);
        }
        // Cộng dồn vào tổng số tiền
        const roomTotal = detailAmount + totalAmenities * detail.roomCount;
        totalAmount += roomTotal;
        
        console.log(`Phòng ${index + 1} (ID: ${detail.roomId}): ${detailAmount.toLocaleString()} VND`);
        console.log(`- Phí phòng: ${detailAmount.toLocaleString()} VND`);
        console.log(`- Phí tiện ích: ${totalAmenities.toLocaleString()} VND`);
        console.log(`- Tổng phí phòng này: ${roomTotal.toLocaleString()} VND`);
        
        // Nếu có chi tiết tiện ích, in ra chi tiết
        if (detail.FactBookingDetailAmenities && detail.FactBookingDetailAmenities.length > 0) {
          detail.FactBookingDetailAmenities.forEach(amenity => {
            const amenityTotal = parseFloat(amenity.price || 0) * parseFloat(amenity.quantity || 0);
            console.log(`  - Tiện ích: ${amenity.Amenities?.amenitiesName || 'Unknown'}, Số lượng: ${amenity.quantity}, Giá: ${parseFloat(amenity.price || 0).toLocaleString()} VND, Thành tiền: ${amenityTotal.toLocaleString()} VND`);
          });
        }
      });
      
      console.log(`Tổng số tiền cần thanh toán: ${totalAmount.toLocaleString()} VND`);

      // Tạo thông tin thanh toán
      const date = new Date();
      const createDate = moment(date).format('YYYYMMDDHHmmss');
      const orderId = moment(date).format('HHmmss');

      // Sử dụng thư viện vnpay để tạo URL thanh toán
      const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TxnRef: orderId,
        vnp_IpAddr: ipAddr,
        vnp_OrderInfo: `Thanh toan don hang`,
        vnp_OrderType: 'billpayment',
        vnp_Amount: Math.round(totalAmount * 100),
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_CreateDate: createDate
      });

      // Lưu thông tin thanh toán vào database
      let payment = await db.Payment.findOne({ where: { bookingId } });
      
      if (!payment) {
        // Tạo mới nếu chưa có
        payment = await db.Payment.create({
          bookingId,
          amount: totalAmount,
          paymentMethod: 'VNPay',
          statusPayment: 'Pending',
          transactionCode: orderId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        // Cập nhật nếu đã có
        await payment.update({
          amount: totalAmount,
          paymentMethod: 'VNPay',
          statusPayment: 'Pending',
          transactionCode: orderId,
          updatedAt: new Date()
        });
      }

      return {
        EM: 'Tạo URL thanh toán thành công',
        EC: 0,
        DT: { paymentUrl }
      };
    } catch (error) {
      console.error('Lỗi khi tạo URL thanh toán:', error);
      return {
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      };
    }
  },

  // Xử lý kết quả thanh toán từ VNPay
  vnpayReturn: async (vnpParams) => {
    try {
      // Sử dụng thư viện vnpay để xác thực dữ liệu trả về
      const verifyResult = vnpay.verifyReturnUrl(vnpParams);
      
      if (verifyResult.isSuccess) {
        // Thanh toán thành công nếu response code là 00
        const responseCode = vnpParams.vnp_ResponseCode;
        const orderId = vnpParams.vnp_TxnRef;
        
        // Tìm thanh toán theo mã giao dịch
        const payment = await db.Payment.findOne({
          where: { transactionCode: orderId }
        });
        
        if (!payment) {
          return {
            EM: 'Không tìm thấy thông tin thanh toán',
            EC: 1,
            DT: []
          };
        }
        
        // Cập nhật thông tin thanh toán
        if (responseCode === '00') {
          // Thanh toán thành công
          await payment.update({
            statusPayment: 'Paid',
            paymentDate: new Date(),
            bankCode: vnpParams.vnp_BankCode,
            cardType: vnpParams.vnp_CardType,
            updatedAt: new Date()
          });
          
          // Cập nhật trạng thái đặt phòng
          const booking = await db.FactBooking.findByPk(payment.bookingId);
          if (booking) {
            // Cập nhật trạng thái các chi tiết đặt phòng
            await db.FactBookingDetail.update(
              { bookingStatus: 'Confirmed' },
              { where: { bookingId: payment.bookingId } }
            );
          }
          
          return {
            EM: 'Thanh toán thành công',
            EC: 0,
            DT: { 
              orderId: payment.bookingId,
              amount: payment.amount,
              paymentDate: payment.paymentDate
            }
          };
        } else {
          // Thanh toán thất bại
          await payment.update({
            statusPayment: 'Failed',
            updatedAt: new Date()
          });
          
          return {
            EM: 'Thanh toán thất bại',
            EC: 1,
            DT: { errorCode: responseCode }
          };
        }
      } else {
        // Chữ ký không hợp lệ
        return {
          EM: 'Chữ ký không hợp lệ',
          EC: 1,
          DT: []
        };
      }
    } catch (error) {
      console.error('Lỗi khi xử lý kết quả thanh toán:', error);
      return {
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      };
    }
  },

  // Lấy thông tin thanh toán theo bookingId
  getPaymentByBookingId: async (bookingId) => {
    try {
      const payment = await db.Payment.findOne({
        where: { bookingId },
        include: [
          {
            model: db.FactBooking,
            include: [
              {
                model: db.FactBookingDetail
              }
            ]
          }
        ]
      });

      if (!payment) {
        return {
          EM: 'Không tìm thấy thông tin thanh toán',
          EC: 1,
          DT: []
        };
      }

      return {
        EM: 'Lấy thông tin thanh toán thành công',
        EC: 0,
        DT: payment
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thanh toán:', error);
      return {
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      };
    }
  },

  // Truy vấn kết quả giao dịch
  queryDr: async (transactionCode) => {
    try {
      // Tìm thanh toán theo mã giao dịch
      const payment = await db.Payment.findOne({
        where: { transactionCode },
        include: [
          {
            model: db.FactBooking
          }
        ]
      });

      if (!payment) {
        return {
          EM: 'Không tìm thấy thông tin thanh toán',
          EC: 1,
          DT: []
        };
      }

      // Format theo định dạng VNPay
      const date = new Date();
      const createDate = moment(date).format('YYYYMMDDHHmmss');
      
      // Sử dụng thư viện vnpay để truy vấn trạng thái giao dịch
      const queryParams = {
        vnp_RequestId: crypto.randomUUID().replace(/-/g, ''),
        vnp_Version: '2.1.0',
        vnp_Command: 'querydr',
        vnp_TmnCode: vnpConfig.tmnCode,
        vnp_TxnRef: transactionCode,
        vnp_OrderInfo: `Truy van giao dich ${transactionCode}`,
        vnp_TransDate: payment.createdAt ? moment(payment.createdAt).format('YYYYMMDDHHmmss') : createDate,
        vnp_CreateDate: createDate,
        vnp_IpAddr: '127.0.0.1'
      };

      // Thực hiện truy vấn thông qua thư viện
      const queryResult = await vnpay.queryDr(queryParams);
      
      if (queryResult.isSuccess) {
        // Cập nhật thông tin thanh toán nếu có kết quả mới
        if (queryResult.responseCode === '00' && payment.statusPayment !== 'Paid') {
          await payment.update({
            statusPayment: 'Paid',
            paymentDate: new Date(),
            updatedAt: new Date()
          });
          
          // Cập nhật trạng thái đặt phòng
          const booking = await db.FactBooking.findByPk(payment.bookingId);
          if (booking) {
            await db.FactBookingDetail.update(
              { bookingStatus: 'Confirmed' },
              { where: { bookingId: payment.bookingId } }
            );
          }
        }
        
        return {
          EM: 'Truy vấn giao dịch thành công',
          EC: 0,
          DT: {
            transactionCode,
            status: queryResult.responseCode === '00' ? 'Success' : 'Failed',
            responseCode: queryResult.responseCode,
            message: queryResult.message
          }
        };
      } else {
        return {
          EM: 'Truy vấn giao dịch thất bại',
          EC: 1,
          DT: {
            transactionCode,
            responseCode: queryResult.responseCode,
            message: queryResult.message
          }
        };
      }
    } catch (error) {
      console.error('Lỗi khi truy vấn kết quả giao dịch:', error);
      return {
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      };
    }
  },

  // Hoàn tiền giao dịch
  refundTransaction: async (transactionCode, amount, message = 'Hoàn tiền') => {
    try {
      // Tìm thanh toán theo mã giao dịch
      const payment = await db.Payment.findOne({
        where: { transactionCode },
        include: [
          {
            model: db.FactBooking
          }
        ]
      });

      if (!payment) {
        return {
          EM: 'Không tìm thấy thông tin thanh toán',
          EC: 1,
          DT: []
        };
      }

      // Kiểm tra trạng thái thanh toán
      if (payment.statusPayment !== 'Paid') {
        return {
          EM: 'Giao dịch này không thể hoàn tiền vì chưa được thanh toán',
          EC: 1,
          DT: []
        };
      }

      // Format theo định dạng VNPay
      const date = new Date();
      const createDate = moment(date).format('YYYYMMDDHHmmss');
      
      // Tạo mã giao dịch hoàn tiền
      const refundOrderId = `RF${moment(date).format('HHmmss')}`;
      
      // Số tiền hoàn, nếu không chỉ định sẽ hoàn toàn bộ
      const refundAmount = amount || payment.amount;
      
      // Sử dụng thư viện vnpay để tạo yêu cầu hoàn tiền
      const refundParams = {
        vnp_RequestId: crypto.randomUUID().replace(/-/g, ''),
        vnp_Version: '2.1.0',
        vnp_Command: 'refund',
        vnp_TmnCode: vnpConfig.tmnCode,
        vnp_TransactionType: '02', // Hoàn toàn phần
        vnp_TxnRef: refundOrderId,
        vnp_Amount: refundAmount * 100, // Số tiền * 100 (VNPay yêu cầu)
        vnp_OrderInfo: message || `Hoan tien giao dich ${transactionCode}`,
        vnp_TransactionNo: payment.vnp_TransactionNo || '', // Mã GD trả về từ VNPAY
        vnp_TransactionDate: payment.paymentDate ? moment(payment.paymentDate).format('YYYYMMDDHHmmss') : createDate,
        vnp_CreateDate: createDate,
        vnp_IpAddr: '127.0.0.1',
        vnp_CreateBy: 'System'
      };

      // Thực hiện yêu cầu hoàn tiền
      const refundResult = await vnpay.refund(refundParams);
      
      if (refundResult.isSuccess) {
        // Cập nhật thông tin thanh toán
        await payment.update({
          statusPayment: 'Refunded',
          refundAmount: refundAmount,
          refundDate: new Date(),
          refundTransactionCode: refundOrderId,
          updatedAt: new Date()
        });
        
        // Cập nhật trạng thái đặt phòng
        if (payment.bookingId) {
          await db.FactBookingDetail.update(
            { bookingStatus: 'Cancelled' },
            { where: { bookingId: payment.bookingId } }
          );
        }
        
        return {
          EM: 'Hoàn tiền thành công',
          EC: 0,
          DT: {
            transactionCode,
            refundOrderId,
            amount: refundAmount,
            responseCode: refundResult.responseCode,
            message: refundResult.message
          }
        };
      } else {
        return {
          EM: 'Hoàn tiền thất bại',
          EC: 1,
          DT: {
            transactionCode,
            responseCode: refundResult.responseCode,
            message: refundResult.message
          }
        };
      }
    } catch (error) {
      console.error('Lỗi khi hoàn tiền giao dịch:', error);
      return {
        EM: 'Lỗi từ server',
        EC: -1,
        DT: []
      };
    }
  }
};

export default paymentService;