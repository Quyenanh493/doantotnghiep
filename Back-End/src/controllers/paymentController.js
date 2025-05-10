import paymentService from '../services/paymentService';

const paymentController = {
  // Tạo URL thanh toán VNPay
  createPaymentUrl: async (req, res, next) => {
    try {
      const { bookingId } = req.body;
      if (!bookingId) {
        return res.status(400).json({
          EM: 'Thiếu thông tin bookingId',
          EC: 1,
          DT: []
        });
      }
      
      const ipAddr = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.connection.socket.remoteAddress;
      console.log('IP Address being sent to VNPay:', ipAddr);
      const result = await paymentService.createPaymentUrl(bookingId, ipAddr);
      console.log('result', result);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong createPaymentUrl controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  },
  
  // Xử lý kết quả thanh toán từ VNPay
  vnpayReturn: async (req, res, next) => {
    try {
      const vnpParams = req.query;
      console.log('VNPay return received:', vnpParams);
      
      const result = await paymentService.vnpayReturn(vnpParams);
      
      // Nếu đây là API endpoint, trả về JSON response
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(result.EC === 0 ? 200 : 400).json({
          EM: result.EM,
          EC: result.EC,
          DT: result.DT
        });
      }
      
      // Nếu là request từ browser, chuyển hướng người dùng đến trang kết quả thanh toán
      if (result.EC === 0) {
        // Chuyển hướng đến trang thanh toán thành công với parameter
        // URL phải tương ứng với route trong ứng dụng Frontend
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?orderId=${result.DT.orderId}&amount=${result.DT.amount}`);
      } else {
        // Chuyển hướng đến trang thanh toán thất bại với message lỗi
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?error=${encodeURIComponent(result.EM)}`);
      }
    } catch (error) {
      console.error('Lỗi trong vnpayReturn controller:', error);
      // Chuyển hướng đến trang lỗi nếu xảy ra exception
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?error=${encodeURIComponent('Lỗi xử lý thanh toán')}`);
    }
  },
  
  // Truy vấn kết quả giao dịch
  queryDr: async (req, res, next) => {
    try {
      const { transactionCode } = req.params;
      
      if (!transactionCode) {
        return res.status(400).json({
          EM: 'Thiếu mã giao dịch',
          EC: 1,
          DT: []
        });
      }
      
      const result = await paymentService.queryDr(transactionCode);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong queryDr controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  },
  
  // Lấy thông tin thanh toán theo bookingId
  getPaymentByBookingId: async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      
      if (!bookingId) {
        return res.status(400).json({
          EM: 'Thiếu thông tin bookingId',
          EC: 1,
          DT: []
        });
      }
      
      const result = await paymentService.getPaymentByBookingId(bookingId);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong getPaymentByBookingId controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  },
  
  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      if (!bookingId) {
        return res.status(400).json({
          EM: 'Thiếu thông tin bookingId',
          EC: 1,
          DT: []
        });
      }
      
      const result = await paymentService.checkPaymentStatus(bookingId);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong checkPaymentStatus controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  },
  
  // Hoàn tiền giao dịch
  refundTransaction: async (req, res, next) => {
    try {
      const { transactionCode, amount, message } = req.body;
      
      if (!transactionCode) {
        return res.status(400).json({
          EM: 'Thiếu mã giao dịch',
          EC: 1,
          DT: []
        });
      }
      
      const result = await paymentService.refundTransaction(transactionCode, amount, message);
      
      return res.status(result.EC === 0 ? 200 : 400).json({
        EM: result.EM,
        EC: result.EC,
        DT: result.DT
      });
    } catch (error) {
      console.error('Lỗi trong refundTransaction controller:', error);
      return res.status(500).json({
        EM: `Lỗi từ server: ${error.message}`,
        EC: -1,
        DT: []
      });
    }
  }
};

export default paymentController;