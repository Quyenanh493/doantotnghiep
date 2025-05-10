import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Form, Input, DatePicker, Button, Typography, Divider, Select, notification, List, Modal, Spin, Result } from 'antd';
import { PlusOutlined, QrcodeOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import './BookingConfirmation.scss';
import { setBookingInfo, resetBooking, addAmenity } from '../../redux/booking/bookingSlice';
import { getRoomDetails, createBooking, createPaymentUrl, checkPaymentStatus } from '../../services/bookingService';

const { Title, Text } = Typography;
const { Option } = Select;

function BookingConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isRoomDetailsFetched, setIsRoomDetailsFetched] = useState(false);
  const [locationState, setLocationState] = useState(null);
  const [notiApi, contextHolder] = notification.useNotification();
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isVNPayModalVisible, setIsVNPayModalVisible] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentStatusInterval, setPaymentStatusInterval] = useState(null);

  const bookingInfo = useSelector((state) => state.booking.bookingInfo);
  const selectedAmenities = useSelector((state) => state.booking.selectedAmenities);

  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      console.error('Error parsing user data:', error);
      return {};
    }
  }, []);

  const fetchRoomDetails = async (roomId, checkInDate, checkOutDate, daysCount, adults, children, roomCount) => {
    try {
      setLoading(true);
      const response = await getRoomDetails(roomId);
      if (response && response.DT) {
        const roomData = response.DT;
        
        if (roomData.Amenities && Array.isArray(roomData.Amenities)) {
          setRoomAmenities(roomData.Amenities);
          roomData.Amenities.forEach(amenity => {
            const isAlreadyAdded = selectedAmenities.some(item => item.id === amenity.amenitiesId);
            if (!isAlreadyAdded) {
              dispatch(addAmenity({
                id: amenity.amenitiesId,
                name: amenity.amenitiesName,
                price: amenity.price || 0,
                quantity: 1,
                isIncluded: true
              }));
            }
          });
        }
        
        let amenitiesTotal = roomData.Amenities ? 
          roomCount * daysCount * roomData.Amenities.reduce((total, item) => total + Number(item.price || 0), 0) : 0;
        
        const totalAmount = roomCount * daysCount * (Number(roomData.price) || 0) + Number(amenitiesTotal);
        
        dispatch(setBookingInfo({
          roomId: roomData.roomId,
          roomName: roomData.roomName,
          roomImage: roomData.roomImage || '',
          roomPrice: Number(roomData.price) || 0,
          checkInDate: dayjs(checkInDate).format('YYYY-MM-DD'),
          checkOutDate: dayjs(checkOutDate).format('YYYY-MM-DD'),
          daysCount: daysCount,
          roomCount: Number(roomCount),
          adultCount: Number(adults),
          childrenCount: Number(children),
          totalAmount: totalAmount,
          hotelInfo: roomData.Hotel || null,
          customerName: userData.customerName || userData.name || '',
          phoneNumber: userData.phoneNumber || userData.phone || '',
        }));
        
        form.setFieldsValue({
          customerName: userData.customerName || userData.name || '',
          phoneNumber: userData.phoneNumber || userData.phone || '',
        });
        
        setIsRoomDetailsFetched(true);
      } else {
        throw new Error('Không tìm thấy thông tin phòng');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phòng:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Không thể tải thông tin phòng. Vui lòng thử lại.'
      });
      navigate('/room');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBookingState = () => {
      if (location.state) {
        localStorage.setItem('bookingState', JSON.stringify(location.state));
        setLocationState(location.state);
      } else {
        const savedState = JSON.parse(localStorage.getItem('bookingState') || '{}');
        if (savedState.roomId && savedState.dateIn && savedState.dateOut) {
          setLocationState(savedState);
        } else {
          notiApi.error({
            message: 'Lỗi',
            description: 'Không tìm thấy thông tin đặt phòng.'
          });
          navigate('/room');
        }
      }
    };

    loadBookingState();
  }, [location.state, navigate, notiApi]);

  useEffect(() => {
    if (!locationState) return;

    const { dateIn, dateOut, adults, children, roomCount, roomId } = locationState;
    if (!roomId || !dateIn || !dateOut) {
      notiApi.error({
        message: 'Lỗi',
        description: 'Thiếu thông tin đặt phòng. Vui lòng thử lại.'
      });
      navigate('/room');
      return;
    }

    const checkInDate = dayjs(dateIn);
    const checkOutDate = dayjs(dateOut);
    if (!checkInDate.isValid() || !checkOutDate.isValid() || checkOutDate.isBefore(checkInDate)) {
      notiApi.error({
        message: 'Lỗi',
        description: 'Ngày nhận hoặc trả phòng không hợp lệ.'
      });
      navigate('/room');
      return;
    }
    const daysCount = checkOutDate.diff(checkInDate, 'day');
    if (daysCount <= 0) {
      notiApi.error({
        message: 'Lỗi',
        description: 'Số ngày đặt phòng phải lớn hơn 0.'
      });
      navigate('/room');
      return;
    }

    fetchRoomDetails(roomId, dateIn, dateOut, daysCount, adults, children, roomCount);
  }, [locationState, navigate, notiApi, userData, form, dispatch, selectedAmenities]);

  const calculateTotalAmount = () => {
    const roomTotal = (bookingInfo.roomPrice || 0) * (bookingInfo.daysCount || 1) * (bookingInfo.roomCount || 1);
    const additionalAmenitiesTotal = bookingInfo.roomCount * bookingInfo.daysCount * selectedAmenities
      .filter(item => !item.isIncluded)
      .reduce((total, item) => total + Number(item.price || 0), 0);
    const includedAmenitiesTotal = bookingInfo.roomCount * bookingInfo.daysCount * selectedAmenities
      .filter(item => item.isIncluded)
      .reduce((total, item) => total + Number(item.price || 0), 0);
    
    return roomTotal + additionalAmenitiesTotal + includedAmenitiesTotal;
  };

  const handleDateChange = (field, date) => {
    if (!date) return;

    const formattedDate = date.format('YYYY-MM-DD');
    const currentCheckInDate = dayjs(bookingInfo.checkInDate);
    const currentCheckOutDate = dayjs(bookingInfo.checkOutDate);

    if (field === 'checkInDate') {
      if (dayjs(formattedDate).isAfter(currentCheckOutDate) || dayjs(formattedDate).isBefore(dayjs().startOf('day'))) {
        notiApi.warning({
          message: 'Lỗi',
          description: 'Ngày nhận phòng phải trước ngày trả phòng và không trong quá khứ.'
        });
        return;
      }

      const daysCount = currentCheckOutDate.diff(dayjs(formattedDate), 'day');
      dispatch(setBookingInfo({
        ...bookingInfo,
        checkInDate: formattedDate,
        daysCount: daysCount > 0 ? daysCount : 1,
        totalAmount: calculateTotalAmount()
      }));
    } else if (field === 'checkOutDate') {
      if (dayjs(formattedDate).isBefore(currentCheckInDate) || dayjs(formattedDate).isSame(currentCheckInDate)) {
        notiApi.warning({
          message: 'Lỗi',
          description: 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày.'
        });
        return;
      }

      const daysCount = dayjs(formattedDate).diff(currentCheckInDate, 'day');
      dispatch(setBookingInfo({
        ...bookingInfo,
        checkOutDate: formattedDate,
        daysCount: daysCount > 0 ? daysCount : 1,
        totalAmount: calculateTotalAmount()
      }));
    }
  };

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatusHandler = async () => {
    if (!bookingId) return;
    
    setCheckingPayment(true);
    try {
      const response = await checkPaymentStatus(bookingId);
      if (response && response.EC === 0) {
        const payment = response.DT;
        setPaymentStatus(payment.statusPayment);
        
        if (payment.statusPayment === 'Paid') {
          // Thanh toán thành công, dừng kiểm tra và hiển thị thông báo
          clearInterval(paymentStatusInterval);
          notiApi.success({
            message: 'Thanh toán thành công',
            description: 'Cảm ơn bạn đã đặt phòng và thanh toán!'
          });
          setIsVNPayModalVisible(false);
          setTimeout(() => {
            navigate('/history-room');
          }, 2000);
        } else if (payment.statusPayment === 'Failed') {
          // Thanh toán thất bại, dừng kiểm tra và hiển thị thông báo
          clearInterval(paymentStatusInterval);
          notiApi.error({
            message: 'Thanh toán thất bại',
            description: 'Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
    } finally {
      setCheckingPayment(false);
    }
  };

  // Hủy interval khi component unmount
  useEffect(() => {
    return () => {
      if (paymentStatusInterval) {
        clearInterval(paymentStatusInterval);
      }
    };
  }, [paymentStatusInterval]);

  const handleBookNow = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      dispatch(setBookingInfo({
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        specialRequests: values.specialRequests,
        paymentMethod: values.paymentMethod,
        totalAmount: calculateTotalAmount()
      }));

      // Chuẩn bị dữ liệu đặt phòng
      const bookingData = {
        customerId: userData.customerId,
        hotelId: bookingInfo.hotelInfo?.hotelId || 1,
        paymentMethod: values.paymentMethod,
        rooms: [{
          roomId: bookingInfo.roomId,
          roomCount: bookingInfo.roomCount || 0,
          adultCount: bookingInfo.adultCount || 0,
          childrenCount: bookingInfo.childrenCount || 0,
          specialRequests: values.specialRequests || "khong yeu cau",
          amenities: selectedAmenities.map(item => ({
            amenitiesId: item.id,
            quantity: bookingInfo.roomCount
          }))
        }],
        dateIn: bookingInfo.checkInDate,
        dateOut: bookingInfo.checkOutDate
      };

      console.log("bookingData", bookingData);

      // Lấy địa chỉ IP của client
      let ipAddr = '127.0.0.1'; // Mặc định localhost
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        ipAddr = ipResponse.data.ip;
      } catch (error) {
        console.warn('Không thể lấy IP client, sử dụng IP mặc định:', error);
      }

      // Gửi yêu cầu đặt phòng
      const response = await createBooking(bookingData);
      console.log("response", response);
      
      if (response && response.EC === 0) {
        // Lưu bookingId để sử dụng sau này
        const newBookingId = response.DT.bookingId;
        console.log("newBookingId", newBookingId);
        setBookingId(newBookingId);
        
        if (values.paymentMethod === 'VNPay') {
          // Tạo URL thanh toán VNPay
          const paymentResponse = await createPaymentUrl(newBookingId, ipAddr);
          
          if (paymentResponse && paymentResponse.EC === 0 && paymentResponse.DT.paymentUrl) {
            setPaymentUrl(paymentResponse.DT.paymentUrl);
            setIsVNPayModalVisible(true);
            
            // Thiết lập kiểm tra trạng thái thanh toán mỗi 5 giây
            const intervalId = setInterval(checkPaymentStatusHandler, 5000);
            setPaymentStatusInterval(intervalId);
          } else {
            notiApi.error({
              message: 'Lỗi thanh toán',
              description: 'Không thể tạo URL thanh toán. Vui lòng thử lại hoặc chọn phương thức khác.'
            });
          }
        } else {
          // Phương thức thanh toán khác
          notiApi.success({
            message: 'Đặt phòng thành công',
            description: 'Đơn đặt phòng của bạn đã được ghi nhận. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!'
          });
          dispatch(resetBooking());
          setTimeout(() => {
            navigate('/history-room');
          }, 2000);
        }
      } else {
        notiApi.error({
          message: 'Đặt phòng thất bại',
          description: response?.EM || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau!'
        });
      }
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error);
      notiApi.error({
        message: 'Đặt phòng thất bại',
        description: 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau!'
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
      dispatch(resetBooking());
      navigate('/history-room');
    } else if (paymentStatus === 'Failed') {
      setIsVNPayModalVisible(false);
      // Có thể hiển thị lựa chọn để thử lại hoặc đổi phương thức thanh toán
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
    // Hỏi xác nhận nếu muốn hủy quá trình thanh toán
    Modal.confirm({
      title: 'Hủy thanh toán?',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn hủy quá trình thanh toán này không? Đơn đặt phòng của bạn vẫn sẽ được lưu nhưng ở trạng thái chưa thanh toán.',
      onOk() {
        if (paymentStatusInterval) {
          clearInterval(paymentStatusInterval);
        }
        setIsVNPayModalVisible(false);
        navigate('/history-room');
      }
    });
  };

  // Mở URL thanh toán trong cửa sổ mới
  const openPaymentUrl = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  const goToAmenities = () => {
    navigate('/booking-amenities');
  };

  if (loading || !bookingInfo.roomId) {
    return (
      <div className="booking-confirmation">
        {contextHolder}
        <Title level={1} className="booking-confirmation__title">XÁC NHẬN ĐẶT PHÒNG</Title>
        <Text>Đang tải thông tin đặt phòng...</Text>
      </div>
    );
  }

  // Kiểm tra thông tin đặt phòng hợp lệ
  if (!bookingInfo.roomId || !bookingInfo.checkInDate || !bookingInfo.checkOutDate) {
    return (
      <div className="booking-confirmation">
        {contextHolder}
        <Result
          status="warning"
          title="Thông tin đặt phòng không hợp lệ"
          subTitle="Vui lòng chọn phòng và nhập thông tin đặt phòng chính xác."
          extra={
            <Button type="primary" onClick={() => navigate('/room')}>
              Quay lại trang tìm phòng
            </Button>
          }
        />
      </div>
    );
  }

  const includedAmenities = selectedAmenities.filter(item => item.isIncluded);
  const additionalAmenities = selectedAmenities.filter(item => !item.isIncluded);

  return (
    <div className="booking-confirmation">
      {contextHolder}
      <Title level={1} className="booking-confirmation__title">XÁC NHẬN ĐẶT PHÒNG</Title>
      <div className="booking-confirmation__breadcrumb">
        <span>TRANG CHỦ</span> &gt; <span>PHÒNG</span> &gt; <span>XÁC NHẬN</span>
      </div>

      <Row gutter={[24, 24]} className="booking-confirmation__content">
        <Col xs={24} md={12}>
          <Card className="booking-confirmation__room-card">
            <div className="booking-confirmation__room-image">
              <img
                src={bookingInfo.roomImage ? `http://localhost:6969/images/${bookingInfo.roomImage}` : 'https://via.placeholder.com/500x300'}
                alt={bookingInfo.roomName || 'Phòng'}
              />
            </div>
            <div className="booking-confirmation__room-info">
              <h2 className="booking-confirmation__room-name">{bookingInfo.roomName || 'Phòng Bình Dân'}</h2>
              <p className="booking-confirmation__room-price">
                {bookingInfo.roomPrice ? Number(bookingInfo.roomPrice).toLocaleString() : '800,000'} vnđ
              </p>
              {bookingInfo.hotelInfo && (
                <p className="booking-confirmation__hotel-name">
                  <strong>Khách sạn:</strong> {bookingInfo.hotelInfo.hotelName}
                </p>
              )}
              <p className="booking-confirmation__room-description">
                {bookingInfo.description || 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản.'}
              </p>
            </div>

            {includedAmenities.length > 0 && (
              <div className="booking-confirmation__amenities booking-confirmation__included-amenities">
                <h3>Tiện nghi có sẵn của phòng:</h3>
                <List
                  itemLayout="horizontal"
                  dataSource={includedAmenities}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={`${Number(item.price || 0).toLocaleString()} vnđ`}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}

            {additionalAmenities.length > 0 && (
              <div className="booking-confirmation__amenities booking-confirmation__additional-amenities">
                <h3>Tiện nghi bổ sung đã chọn:</h3>
                <List
                  itemLayout="horizontal"
                  dataSource={additionalAmenities}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={`${Number(item.price || 0).toLocaleString()} vnđ`}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="booking-confirmation__details-card">
            <Title level={3}>CHI TIẾT PHÒNG ĐẶT</Title>

            <Form form={form} layout="vertical" className="booking-confirmation__form">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="customerName"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Số Điện Thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="specialRequests" label="Yêu cầu đặc biệt">
                <Input.TextArea rows={3} placeholder="Nhập yêu cầu đặc biệt nếu có" />
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Phương thức thanh toán"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                initialValue="VNPay"
              >
                <Select>
                  <Option value="Cash">Tiền mặt</Option>
                  <Option value="CreditCard">Thẻ tín dụng</Option>
                  <Option value="BankTransfer">Chuyển khoản ngân hàng</Option>
                  <Option value="VNPay">VNPay (Quét mã QR)</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Ngày Nhận Phòng">
                    <DatePicker
                      value={dayjs(bookingInfo.checkInDate)}
                      onChange={(date) => handleDateChange('checkInDate', date)}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày Trả Phòng">
                    <DatePicker
                      value={dayjs(bookingInfo.checkOutDate)}
                      onChange={(date) => handleDateChange('checkOutDate', date)}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current <= dayjs(bookingInfo.checkInDate)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className="booking-confirmation__summary">
                <div className="booking-confirmation__summary-item">
                  <span>Số Phòng: {bookingInfo.roomCount || 1}</span>
                </div>
                <div className="booking-confirmation__summary-item">
                  <span>Số người lớn: {bookingInfo.adultCount || 2}</span>
                </div>
                <div className="booking-confirmation__summary-item">
                  <span>Số trẻ em: {bookingInfo.childrenCount || 0}</span>
                </div>
                <div className="booking-confirmation__summary-item">
                  <span>Số ngày đặt: {bookingInfo.daysCount || 1}</span>
                </div>
                
                <Divider />
                
                <div className="booking-confirmation__summary-item">
                  <span>Giá phòng: {(bookingInfo.roomPrice || 0).toLocaleString()} vnđ</span>
                  <span>{((bookingInfo.roomPrice || 0) * (bookingInfo.daysCount || 1) * (bookingInfo.roomCount)).toLocaleString()} vnđ</span>
                </div>
                
                {includedAmenities.length > 0 && (
                  <div className="booking-confirmation__summary-item">
                    <span>Tiện ích có sẵn: {includedAmenities.reduce((total, item) => total + Number(item.price || 0), 0).toLocaleString()} vnđ</span>
                    <span>
                      {(bookingInfo.roomCount * bookingInfo.daysCount * includedAmenities.reduce((total, item) => total + Number(item.price || 0), 0)).toLocaleString()} vnđ
                    </span>
                  </div>
                )}
                
                {additionalAmenities.length > 0 && (
                  <div className="booking-confirmation__summary-item">
                    <span>Tiện ích bổ sung: {additionalAmenities.reduce((total, item) => total + Number(item.price || 0), 0).toLocaleString()} vnđ</span>
                    <span>
                      {(bookingInfo.roomCount * bookingInfo.daysCount * additionalAmenities.reduce((total, item) => total + Number(item.price || 0), 0)).toLocaleString()} vnđ
                    </span>
                  </div>
                )}
                
                <div className="booking-confirmation__summary-item booking-confirmation__summary-total">
                  <span>Tổng số tiền phải trả:</span>
                  <span>{calculateTotalAmount().toLocaleString()} vnđ</span>
                </div>
              </div>

              <div className="booking-confirmation__actions">
                <Button
                  type="primary"
                  className="booking-confirmation__book-btn"
                  onClick={handleBookNow}
                  loading={loading}
                >
                  Đặt Ngay
                </Button>

                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  className="booking-confirmation__amenities-btn"
                  onClick={goToAmenities}
                  disabled={loading}
                >
                  Thêm Tiện Nghi
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Thanh toán bằng VNPay"
        open={isVNPayModalVisible}
        onOk={handleVNPayModalOk}
        onCancel={handleVNPayModalCancel}
        okText="Đã thanh toán"
        cancelText="Hủy"
        okButtonProps={{ loading: checkingPayment }}
      >
        <div style={{ textAlign: 'center' }}>
          <p>Nhấn vào nút bên dưới để mở trang thanh toán VNPay:</p>
          
          <Button 
            type="primary" 
            icon={<QrcodeOutlined />} 
            onClick={openPaymentUrl} 
            style={{ margin: '20px 0' }}
          >
            Mở Trang Thanh Toán VNPay
          </Button>
          
          {checkingPayment && (
            <div style={{ margin: '20px 0' }}>
              <Spin /> <span style={{ marginLeft: 10 }}>Đang kiểm tra trạng thái thanh toán...</span>
            </div>
          )}
          
          {paymentStatus === 'Paid' && (
            <div style={{ margin: '20px 0', color: '#52c41a' }}>
              <CheckCircleOutlined style={{ fontSize: 24 }} /> <span style={{ marginLeft: 10 }}>Thanh toán thành công!</span>
            </div>
          )}
          
          {paymentStatus === 'Failed' && (
            <div style={{ margin: '20px 0', color: '#f5222d' }}>
              <ExclamationCircleOutlined style={{ fontSize: 24 }} /> <span style={{ marginLeft: 10 }}>Thanh toán thất bại!</span>
            </div>
          )}
          
          <p style={{ marginTop: 16 }}>
            Sau khi thanh toán, nhấn "Đã thanh toán" để hệ thống kiểm tra và xác nhận thanh toán của bạn.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default BookingConfirmation;