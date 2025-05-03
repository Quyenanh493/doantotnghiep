import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Form, Input, DatePicker, Button, Typography, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './BookingConfirmation.scss';
import { setBookingInfo } from '../../redux/booking/bookingSlice';

const { Title, Text } = Typography;

function BookingConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  
  const bookingInfo = useSelector(state => state.booking.bookingInfo);
  const selectedAmenities = useSelector(state => state.booking.selectedAmenities);
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Lấy thông tin từ state của location nếu có
  useEffect(() => {
    if (location.state?.roomData) {
      const { roomData, checkInDate, checkOutDate, daysCount } = location.state;
      
      // Cập nhật thông tin đặt phòng vào Redux
      dispatch(setBookingInfo({
        roomId: roomData.id || roomData.roomId,
        roomName: roomData.roomName,
        roomImage: roomData.roomImage,
        roomPrice: roomData.price || roomData.roomPrice,
        checkInDate,
        checkOutDate,
        daysCount,
        roomCount: 1,
        totalAmount: (roomData.price || roomData.roomPrice) * daysCount
      }));
    }
  }, [location.state, dispatch]);
  
  // Điền thông tin người dùng vào form
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        customerName: userData.customerName || userData.name || '',
        phoneNumber: userData.phoneNumber || userData.phone || '',
        address: userData.address || '',
      });
      
      // Cập nhật thông tin khách hàng vào Redux
      dispatch(setBookingInfo({
        customerName: userData.customerName || userData.name || '',
        phoneNumber: userData.phoneNumber || userData.phone || '',
        address: userData.address || '',
      }));
    }
  }, [userData, form, dispatch]);
  
  // Tính tổng tiền bao gồm cả tiện nghi
  const calculateTotalAmount = () => {
    const roomTotal = bookingInfo.roomPrice * bookingInfo.daysCount;
    const amenitiesTotal = selectedAmenities.reduce((total, item) => total + Number(item.price), 0);
    return roomTotal + amenitiesTotal;
  };
  
  // Xử lý khi nhấn nút đặt ngay
  const handleBookNow = () => {
    form.validateFields().then(values => {
      // Cập nhật thông tin khách hàng vào Redux
      dispatch(setBookingInfo({
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        address: values.address,
        totalAmount: calculateTotalAmount()
      }));
      
      // Chuyển đến trang thanh toán hoặc xử lý đặt phòng
      // navigate('/payment');
      console.log('Đặt phòng với thông tin:', {
        ...bookingInfo,
        customerName: values.customerName,
        phoneNumber: values.phoneNumber,
        address: values.address,
        selectedAmenities,
        totalAmount: calculateTotalAmount()
      });
    });
  };
  
  // Chuyển đến trang tiện nghi
  const goToAmenities = () => {
    navigate('/booking-amenities');
  };
  
  return (
    <div className="booking-confirmation">
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
                alt={bookingInfo.roomName} 
              />
            </div>
            <div className="booking-confirmation__room-info">
              <h2 className="booking-confirmation__room-name">{bookingInfo.roomName || 'Phòng Bình Dân'}</h2>
              <p className="booking-confirmation__room-price">{Number(bookingInfo.roomPrice).toLocaleString() || '800000'} vnđ</p>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card className="booking-confirmation__details-card">
            <Title level={3}>CHI TIẾT PHÒNG ĐẶT</Title>
            
            <Form
              form={form}
              layout="vertical"
              className="booking-confirmation__form"
            >
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
              
              <Form.Item
                name="address"
                label="Địa Chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Ngày Nhận Phòng">
                    <DatePicker 
                      value={bookingInfo.checkInDate ? dayjs(bookingInfo.checkInDate) : null}
                      format="DD/MM/YYYY"
                      disabled
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày Trả Phòng">
                    <DatePicker 
                      value={bookingInfo.checkOutDate ? dayjs(bookingInfo.checkOutDate) : null}
                      format="DD/MM/YYYY"
                      disabled
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <div className="booking-confirmation__summary">
                <div className="booking-confirmation__summary-item">
                  <span>Số Phòng Trống: {bookingInfo.roomCount || 4}</span>
                </div>
                <div className="booking-confirmation__summary-item">
                  <span>Số ngày Đặt: {bookingInfo.daysCount || 6}</span>
                </div>
                <div className="booking-confirmation__summary-item">
                  <span>Tổng số tiền phải trả: {calculateTotalAmount().toLocaleString() || '4800000'} vnđ</span>
                </div>
              </div>
              
              <div className="booking-confirmation__actions">
                <Button 
                  type="primary" 
                  className="booking-confirmation__book-btn"
                  onClick={handleBookNow}
                >
                  Đặt Ngay
                </Button>
                
                <Button 
                  type="default" 
                  icon={<PlusOutlined />}
                  className="booking-confirmation__amenities-btn"
                  onClick={goToAmenities}
                >
                  Thêm Tiện Nghi
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default BookingConfirmation;