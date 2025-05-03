import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Checkbox, Typography, Divider, Image, Spin, Empty } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getAllAmenities } from '../../services/amenitiesService';
import { addAmenity, removeAmenity } from '../../redux/booking/bookingSlice';
import './BookingAmenities.scss';

const { Title, Text } = Typography;

function BookingAmenities() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const selectedAmenities = useSelector(state => state.booking.selectedAmenities);
  
  // Lấy danh sách tiện nghi từ API
  useEffect(() => {
    const fetchAmenities = async () => {
      setLoading(true);
      try {
        const response = await getAllAmenities();
        if (response && response.DT) {
          setAmenities(response.DT);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tiện nghi:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAmenities();
  }, []);
  
  // Kiểm tra tiện nghi đã được chọn chưa
  const isAmenitySelected = (amenityId) => {
    return selectedAmenities.some(item => item.id === amenityId);
  };
  
  // Xử lý khi chọn/bỏ chọn tiện nghi
  const handleAmenityToggle = (amenity) => {
    if (isAmenitySelected(amenity.id)) {
      dispatch(removeAmenity(amenity.id));
    } else {
      dispatch(addAmenity({
        id: amenity.id,
        name: amenity.amenitiesName,
        price: amenity.price,
        icon: amenity.icon
      }));
    }
  };
  
  // Quay lại trang xác nhận đặt phòng
  const goBackToBooking = () => {
    navigate('/booking-confirmation');
  };
  
  // Tính tổng tiền tiện nghi đã chọn
  const calculateTotalAmenitiesPrice = () => {
    return selectedAmenities.reduce((total, item) => total + Number(item.price), 0);
  };
  
  return (
    <div className="booking-amenities">
      <div className="booking-amenities__header">
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={goBackToBooking}
          className="booking-amenities__back-btn"
        >
          Quay Lại Thanh Toán
        </Button>
        <Title level={2} className="booking-amenities__title">
          Chọn Tiện Nghi Bổ Sung
        </Title>
      </div>
      
      <div className="booking-amenities__selected">
        <Card className="booking-amenities__selected-card">
          <div className="booking-amenities__selected-header">
            <ShoppingCartOutlined className="booking-amenities__cart-icon" />
            <span>Tiện nghi đã chọn: {selectedAmenities.length}</span>
          </div>
          <div className="booking-amenities__selected-total">
            Tổng tiền: {calculateTotalAmenitiesPrice().toLocaleString()} vnđ
          </div>
        </Card>
      </div>
      
      <Divider />
      
      <Spin spinning={loading}>
        {amenities.length > 0 ? (
          <Row gutter={[16, 16]} className="booking-amenities__list">
            {amenities.map(amenity => (
              <Col xs={24} sm={12} md={8} lg={6} key={amenity.id}>
                <Card 
                  className={`booking-amenities__item ${isAmenitySelected(amenity.id) ? 'booking-amenities__item--selected' : ''}`}
                  hoverable
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  <div className="booking-amenities__item-content">
                    <div className="booking-amenities__item-image">
                      <Image 
                        src={amenity.icon || `https://via.placeholder.com/100?text=${encodeURIComponent(amenity.amenitiesName)}`}
                        alt={amenity.amenitiesName}
                        preview={false}
                      />
                    </div>
                    <div className="booking-amenities__item-info">
                      <h3 className="booking-amenities__item-name">{amenity.amenitiesName}</h3>
                      <p className="booking-amenities__item-price">{Number(amenity.price).toLocaleString()} vnđ</p>
                    </div>
                    <Checkbox 
                      className="booking-amenities__item-checkbox" 
                      checked={isAmenitySelected(amenity.id)}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Không có tiện nghi nào" />
        )}
      </Spin>
      
      <div className="booking-amenities__footer">
        <Button 
          type="primary" 
          size="large"
          onClick={goBackToBooking}
          className="booking-amenities__confirm-btn"
        >
          Xác Nhận Và Quay Lại
        </Button>
      </div>
    </div>
  );
}

export default BookingAmenities;