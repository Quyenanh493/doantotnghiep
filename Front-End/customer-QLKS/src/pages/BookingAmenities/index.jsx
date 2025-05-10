import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Checkbox, Typography, Divider, Image, Spin, Empty, Result } from 'antd';
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

  const selectedAmenities = useSelector((state) => state.booking.selectedAmenities);
  const bookingInfo = useSelector((state) => state.booking.bookingInfo);

  // Kiểm tra xem người dùng đã đặt phòng chưa
  const hasBookingInfo = bookingInfo && bookingInfo.roomId && bookingInfo.checkInDate && bookingInfo.checkOutDate;

  // Kiểm tra trạng thái ban đầu
  useEffect(() => {
    console.log('Initial Selected Amenities:', selectedAmenities);
    console.log('Booking Info:', bookingInfo);
  }, []);

  // Lấy danh sách tiện nghi từ API
  useEffect(() => {
    // Chỉ tải tiện nghi khi đã có thông tin đặt phòng
    if (!hasBookingInfo) {
      return;
    }

    const fetchAmenities = async () => {
      setLoading(true);
      try {
        const response = await getAllAmenities();
        console.log('API Response:', response);
        if (response && response.DT) {
          // Ánh xạ amenitiesId thành id
          const mappedAmenities = response.DT.map((item) => ({
            id: item.amenitiesId,
            amenitiesName: item.amenitiesName,
            price: item.price,
            icon: item.icon,
            description: item.description,
          }));
          // Kiểm tra id duy nhất
          const ids = mappedAmenities.map((item) => item.id);
          const uniqueIds = new Set(ids);
          if (ids.length !== uniqueIds.size) {
            console.error('Cảnh báo: Có id trùng lặp trong danh sách tiện ích:', ids);
          }
          setAmenities(mappedAmenities);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tiện nghi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, [hasBookingInfo]);

  // Kiểm tra tiện nghi đã được chọn chưa
  const isAmenitySelected = (amenityId) => {
    return selectedAmenities.some((item) => item.id === amenityId);
  };

  // Kiểm tra xem tiện ích có phải là tiện ích có sẵn của phòng không
  const isIncludedAmenity = (amenityId) => {
    const result = selectedAmenities.some((item) => item.id === amenityId && item.isIncluded === true);
    console.log(`Checking if amenity ${amenityId} is included:`, result);
    return result;
  };

  // Xử lý khi chọn/bỏ chọn tiện nghi
  const handleAmenityToggle = (amenity, e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Toggling amenity:', amenity.id, 'Checked:', e.target.checked);

    if (!amenity.id) {
      console.error('Không thể xử lý tiện ích vì id là undefined:', amenity);
      return;
    }

    if (isIncludedAmenity(amenity.id)) {
      return;
    }

    if (isAmenitySelected(amenity.id)) {
      dispatch(removeAmenity(amenity.id));
    } else {
      dispatch(
        addAmenity({
          id: amenity.id,
          name: amenity.amenitiesName,
          price: amenity.price,
          icon: amenity.icon,
        })
      );
    }
  };

  // Quay lại trang xác nhận đặt phòng
  const goBackToBooking = () => {
    navigate('/booking-confirmation');
  };

  // Quay lại trang danh sách phòng
  const goToRoomPage = () => {
    navigate('/room');
  };

  // Tính tổng tiền tiện nghi đã chọn
  const calculateTotalAmenitiesPrice = () => {
    return selectedAmenities.reduce((total, item) => total + Number(item.price), 0);
  };

  // Theo dõi trạng thái selectedAmenities
  useEffect(() => {
    console.log('Selected Amenities:', selectedAmenities);
  }, [selectedAmenities]);

  // Hiển thị thông báo nếu chưa đặt phòng
  if (!hasBookingInfo) {
    return (
      <div className="booking-amenities">
        <Result
          status="warning"
          title="Vui lòng đặt phòng trước"
          subTitle="Bạn cần phải chọn phòng và tiến hành đặt phòng trước khi có thể thêm tiện nghi bổ sung."
          extra={
            <Button type="primary" onClick={goToRoomPage}>
              Tìm và đặt phòng ngay
            </Button>
          }
        />
      </div>
    );
  }

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
            {amenities.map((amenity) => {
              const isIncluded = isIncludedAmenity(amenity.id);
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={amenity.id}>
                  <Card
                    className={`booking-amenities__item ${
                      isAmenitySelected(amenity.id) ? 'booking-amenities__item--selected' : ''
                    } ${isIncluded ? 'booking-amenities__item--included' : ''}`}
                    hoverable={!isIncluded}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Card clicked, but should not trigger amenity toggle');
                    }}
                  >
                    <div className="booking-amenities__item-content">
                      <div className="booking-amenities__item-image">
                        <Image
                          src={
                            amenity.icon ||
                            `https://via.placeholder.com/100?text=${encodeURIComponent(
                              amenity.amenitiesName
                            )}`
                          }
                          alt={amenity.amenitiesName}
                          preview={false}
                        />
                      </div>
                      <div className="booking-amenities__item-info">
                        <h3 className="booking-amenities__item-name">{amenity.amenitiesName}</h3>
                        <p className="booking-amenities__item-price">
                          {Number(amenity.price).toLocaleString()} vnđ
                        </p>
                        {isIncluded && <Text type="success">Đã bao gồm trong phòng</Text>}
                      </div>
                      <Checkbox
                        className="booking-amenities__item-checkbox"
                        checked={isAmenitySelected(amenity.id)}
                        disabled={isIncluded}
                        onChange={(e) => handleAmenityToggle(amenity, e)}
                      />
                    </div>
                  </Card>
                </Col>
              );
            })}
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