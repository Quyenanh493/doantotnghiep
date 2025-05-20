import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Row, Col, notification, Modal, Spin, message } from 'antd';
import { ReloadOutlined, CreditCardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  getFactBookingHistory, 
  createPaymentUrl, 
  checkPaymentStatus, 
  queryTransactionStatus, 
  cancelBooking 
} from '../../services/bookingService';
import './HistoryRoom.scss';

const { Title } = Typography;

function HistoryRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [notiApi, contextHolder] = notification.useNotification();
  const [messageApi] = message.useMessage();
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isVNPayModalVisible, setIsVNPayModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedTransactionCode, setSelectedTransactionCode] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentStatusInterval, setPaymentStatusInterval] = useState(null);

  const fetchBookingHistory = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await getFactBookingHistory(userData.customerId);
      if (response && response.EC === 0) {
        setBookings(response.DT);
      } else {
        notiApi.error({
          message: 'Lỗi',
          description: response?.EM || 'Không thể tải lịch sử đặt phòng'
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch sử đặt phòng:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi tải lịch sử đặt phòng'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  // Hủy interval khi component unmount
  useEffect(() => {
    return () => {
      if (paymentStatusInterval) {
        clearInterval(paymentStatusInterval);
      }
    };
  }, [paymentStatusInterval]);

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatusHandler = async () => {
    if (!selectedBookingId) return;
    
    setCheckingPayment(true);
    try {
      // Sử dụng checkPaymentStatus và queryTransactionStatus để kiểm tra đa chiều
      const response = await checkPaymentStatus(selectedBookingId);
      
      if (response && response.EC === 0) {
        const payment = response.DT;
        setPaymentStatus(payment.statusPayment);
        
        // Nếu trạng thái vẫn là Pending và có mã giao dịch, thử sử dụng queryDr để kiểm tra
        if (payment.statusPayment === 'Pending' && payment.transactionCode) {
          setSelectedTransactionCode(payment.transactionCode);
          try {
            const queryResponse = await queryTransactionStatus(payment.transactionCode);
            if (queryResponse && queryResponse.EC === 0) {
              // Nếu kết quả từ queryDr là thanh toán thành công
              if (queryResponse.DT.status === 'Success') {
                // Cập nhật trạng thái từ kết quả queryDr
                setPaymentStatus('Paid');
                
                // Dừng kiểm tra và hiển thị thông báo
                clearInterval(paymentStatusInterval);
                notiApi.success({
                  message: 'Thanh toán thành công',
                  description: 'Cảm ơn bạn đã thanh toán!'
                });
                setIsVNPayModalVisible(false);
                // Cập nhật lại danh sách đặt phòng
                fetchBookingHistory();
                return;
              }
            }
          } catch (queryError) {
            console.warn('Lỗi khi truy vấn kết quả giao dịch:', queryError);
          }
        }
        
        if (payment.statusPayment === 'Paid') {
          // Thanh toán thành công, dừng kiểm tra và hiển thị thông báo
          clearInterval(paymentStatusInterval);
          notiApi.success({
            message: 'Thanh toán thành công',
            description: 'Cảm ơn bạn đã thanh toán!'
          });
          setIsVNPayModalVisible(false);
          // Cập nhật lại danh sách đặt phòng
          fetchBookingHistory();
        } else if (payment.statusPayment === 'Failed') {
          // Thanh toán thất bại, dừng kiểm tra và hiển thị thông báo
          clearInterval(paymentStatusInterval);
          notiApi.error({
            message: 'Thanh toán thất bại',
            description: 'Vui lòng thử lại hoặc liên hệ hỗ trợ.'
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
    } finally {
      setCheckingPayment(false);
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      setSelectedBookingId(bookingId);
      setLoading(true);
      
      // Lấy địa chỉ IP
      let ipAddr = '127.0.0.1';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddr = ipData.ip;
      } catch (error) {
        console.warn('Không thể lấy IP, sử dụng mặc định:', error);
      }
      
      // Tạo URL thanh toán
      const response = await createPaymentUrl(bookingId, ipAddr);
      
      if (response && response.EC === 0 && response.DT.paymentUrl) {
        setPaymentUrl(response.DT.paymentUrl);
        setIsVNPayModalVisible(true);
        
        // Thiết lập kiểm tra trạng thái thanh toán mỗi 5 giây
        const intervalId = setInterval(checkPaymentStatusHandler, 5000);
        setPaymentStatusInterval(intervalId);
      } else {
        notiApi.error({
          message: 'Lỗi thanh toán',
          description: 'Không thể tạo URL thanh toán. Vui lòng thử lại sau.'
        });
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      notiApi.error({
        message: 'Lỗi thanh toán',
        description: 'Đã xảy ra lỗi khi xử lý thanh toán'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVNPayModalOk = () => {
    // Nếu đang kiểm tra thanh toán, không đóng modal ngay
    if (checkingPayment) return;
    
    // Nếu đã có kết quả thanh toán thì xử lý theo kết quả
    if (paymentStatus === 'Paid') {
      setIsVNPayModalVisible(false);
      fetchBookingHistory();
    } else {
      // Nếu chưa có kết quả, kiểm tra thủ công một lần
      checkPaymentStatusHandler();
      
      // Hiển thị thông báo cho người dùng
      notiApi.info({
        message: 'Đang kiểm tra thanh toán',
        description: 'Vui lòng đợi khi chúng tôi xác nhận trạng thái thanh toán của bạn.'
      });
    }
  };

  const handleVNPayModalCancel = () => {
    if (paymentStatusInterval) {
      clearInterval(paymentStatusInterval);
    }
    setIsVNPayModalVisible(false);
  };

  // Mở URL thanh toán trong cửa sổ mới
  const openPaymentUrl = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  // Hàm hủy đặt phòng
  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await cancelBooking(bookingId);
      if (response && response.EC === 0) {
        messageApi.success('Hủy đặt phòng thành công');
        fetchBookingHistory();
      } else {
        messageApi.error(response?.EM || 'Không thể hủy đặt phòng');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đặt phòng:', error);
      messageApi.error('Đã xảy ra lỗi khi hủy đặt phòng');
    }
  };

  // Hàm kiểm tra xem phòng có thể hủy không (ngày hiện tại < ngày check in)
  const canCancelBooking = (dateIn) => {
    const today = dayjs();
    const checkInDate = dayjs(dateIn);
    return today.isBefore(checkInDate);
  };

  return (
    <div className="history-room">
      {contextHolder}
      
      <div className="history-room__header">
        <Title level={2}>Lịch sử đặt phòng</Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchBookingHistory}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Card className="history-room__card">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Bạn chưa có lịch sử đặt phòng nào.</p>
            <Button type="primary" onClick={() => navigate('/room')}>
              Tìm phòng ngay
            </Button>
          </div>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {bookings.map((booking) => {
            // Tính tổng tiền từ các chi tiết đặt phòng nếu có
            let totalPrice = 0;
            let roomName = "Phòng Đơn"; // Mặc định
            let roomType = "Đơn"; // Mặc định
            
            if (booking.FactBookingDetails && booking.FactBookingDetails.length > 0) {
              booking.FactBookingDetails.forEach(detail => {
                if (detail.Room) {
                  totalPrice += Number(detail.totalAmount || 0);
                  roomName = detail.Room.roomName || roomName;
                  roomType = detail.Room.roomType || roomType;
                }
              });
            } else if (booking.Payment) {
              totalPrice = Number(booking.Payment.amount || 0);
            }
            
            // Kiểm tra trạng thái thanh toán
            const paymentStatus = booking.Payment?.statusPayment || 'Unpaid';
            const isPaid = paymentStatus === 'Paid';
            
            // Format the dates
            const dateIn = dayjs(booking.dateIn).format('DD-MM-YYYY');
            const dateOut = dayjs(booking.dateOut).format('DD-MM-YYYY');
            const orderDate = dayjs(booking.orderDate).format('DD-MM-YYYY');
            
            // Determine room type based on price or other criteria
            const displayRoomName = roomType === 'Standard' ? 'Phòng Đơn' : 
                                   roomType === 'Deluxe' ? 'Phòng Đôi' : 
                                   roomType === 'Family' ? 'Phòng Gia Đình' : roomName;
            
            return (
              <Col xs={24} md={12} lg={8} key={booking.bookingId}>
                <Card className="booking-card">
                  <Title level={4}>{displayRoomName}</Title>
                  <p className="price">{totalPrice.toLocaleString()} vnd</p>
                  
                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="label">Ngày Vào:</span>
                      <span className="value">{dateIn}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Ngày Trả:</span>
                      <span className="value">{dateOut}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Tổng:</span>
                      <span className="value bold">{totalPrice.toLocaleString()} vnd</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">ID Đơn:</span>
                      <span className="value">ORD_{booking.bookingId.toString().padStart(8, '0')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Ngày Đặt:</span>
                      <span className="value">{orderDate}</span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <Button
                      type="primary"
                      className={isPaid ? "paid-btn" : "pay-btn"}
                      disabled={isPaid}
                    >
                      {isPaid ? "Đã Đặt" : "Đặt Lại"}
                    </Button>
                    
                    {!isPaid && canCancelBooking(booking.dateIn) && (
                      <Button 
                        danger
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking.bookingId)}
                      >
                        Hủy Đặt Phòng
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      
      {/* Modal thanh toán VNPay */}
      <Modal
        title="Thanh toán VNPay"
        visible={isVNPayModalVisible}
        onOk={handleVNPayModalOk}
        onCancel={handleVNPayModalCancel}
        footer={[
          <Button key="back" onClick={handleVNPayModalCancel}>
            Đóng
          </Button>,
          <Button 
            key="check" 
            type="default" 
            loading={checkingPayment}
            onClick={checkPaymentStatusHandler}
          >
            Kiểm tra thanh toán
          </Button>,
          <Button 
            key="pay" 
            type="primary" 
            icon={<CreditCardOutlined />}
            onClick={openPaymentUrl}
          >
            Mở trang thanh toán
          </Button>,
        ]}
      >
        <p>Vui lòng click vào nút bên dưới để mở trang thanh toán VNPay.</p>
        <p>Sau khi thanh toán xong, hãy quay lại đây và kiểm tra trạng thái.</p>
        
        {checkingPayment && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Spin />
            <p>Đang kiểm tra trạng thái thanh toán...</p>
          </div>
        )}
        
        {paymentStatus && (
          <div style={{ margin: '20px 0' }}>
            <p>
              <strong>Trạng thái thanh toán: </strong>
              {paymentStatus === 'Paid' ? (
                <span style={{ color: 'green' }}>Thành công</span>
              ) : paymentStatus === 'Failed' ? (
                <span style={{ color: 'red' }}>Thất bại</span>
              ) : (
                <span style={{ color: 'orange' }}>Đang xử lý</span>
              )}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default HistoryRoom;