import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Rate, Divider, Spin, Image, Tag, List, Typography } from 'antd';
import { WifiOutlined, CoffeeOutlined, CarOutlined, ShoppingOutlined } from '@ant-design/icons';
import { getRoomById } from '../../services/roomService';
import { getAmenityByRoomId } from '../../services/amenitiesService';
import './RoomDetail.scss';

const { Title, Text } = Typography;

// Hàm này giúp chọn icon phù hợp cho từng loại tiện ích
const getAmenityIcon = (amenityName) => {
  const name = (amenityName || '').toLowerCase();
  
  if (name.includes('wifi') || name.includes('internet')) {
    return <WifiOutlined />;
  } else if (name.includes('coffee') || name.includes('cà phê') || name.includes('trà') || name.includes('tea')) {
    return <CoffeeOutlined />;
  } else if (name.includes('parking') || name.includes('đỗ xe')) {
    return <CarOutlined />;
  } else {
    return <ShoppingOutlined />;
  }
};

function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin phòng
        const roomResponse = await getRoomById(roomId);
        if (roomResponse && roomResponse.DT) {
          setRoom(roomResponse.DT);
        }
        
        // Lấy tiện ích của phòng
        const amenitiesResponse = await getAmenityByRoomId(roomId);
        if (amenitiesResponse && amenitiesResponse.DT) {
          setAmenities(amenitiesResponse.DT);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin phòng:', error);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetail();
    }
  }, [roomId]);

  if (loading) {
    return (
      <div className="room-detail__loading">
        <Spin size="large" tip="Đang tải thông tin phòng..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-detail__error">
        <h2>Không tìm thấy thông tin phòng</h2>
        <p>Phòng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  return (
    <div className="room-detail">
      <Card className="room-detail__card">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={24}>
            <div className="room-detail__header">
              <h1 className="room-detail__title">{room.roomName}</h1>
              <div className="room-detail__meta">
                <div className="room-detail__rating">
                  <Rate disabled defaultValue={room.roomStar || 0} allowHalf />
                  <span className="room-detail__rating-text">{room.roomStar || 0}/5</span>
                </div>
                <div className="room-detail__price">
                  <Text strong>{Number(room.price).toLocaleString()} vnđ</Text> / đêm
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24}>
            <div className="room-detail__image-container">
              <Image
                className="room-detail__image"
                src={room.roomImage}
                alt={room.roomName}
                preview={true}
              />
            </div>
          </Col>
          
          <Col xs={24} md={16}>
            <Divider />
            <div className="room-detail__description">
              <h2 className="room-detail__section-title">Mô tả phòng</h2>
              <p className="room-detail__description-text">
                {room.description || 'Phòng sang trọng với đầy đủ tiện nghi hiện đại, không gian thoáng đãng và view đẹp. Phòng được thiết kế theo phong cách hiện đại, tạo cảm giác thoải mái và ấm cúng cho khách hàng. Đây là lựa chọn hoàn hảo cho kỳ nghỉ của bạn.'}
              </p>
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <Divider />
            <div className="room-detail__info">
              <h2 className="room-detail__section-title">Thông tin phòng</h2>
              <List className="room-detail__info-list">
                <List.Item>
                  <span className="room-detail__info-label">Loại phòng:</span>
                  <span className="room-detail__info-value">{room.roomType || 'Chưa cập nhật'}</span>
                </List.Item>
                <List.Item>
                  <span className="room-detail__info-label">Sức chứa:</span>
                  <span className="room-detail__info-value">Tối đa {room.maxCustomer || 2} khách</span>
                </List.Item>
                <List.Item>
                  <span className="room-detail__info-label">Phòng trống:</span>
                  <span className="room-detail__info-value">{room.maxRoom || 0} phòng</span>
                </List.Item>
              </List>
            </div>
          </Col>
          
          <Col xs={24}>
            <Divider />
            <div className="room-detail__amenities">
              <h2 className="room-detail__section-title">Tiện ích phòng</h2>
              <div className="room-detail__amenities-container">
                {amenities.length > 0 ? (
                  <Row gutter={[16, 16]}>
                    {amenities.map(amenity => (
                      <Col xs={12} sm={8} md={6} key={amenity.amenitiesId}>
                        <Card className="room-detail__amenity-card">
                          <div className="room-detail__amenity-icon">
                            {getAmenityIcon(amenity.amenitiesName)}
                          </div>
                          <div className="room-detail__amenity-name">
                            {amenity.amenitiesName}
                          </div>
                          {amenity.price > 0 && (
                            <div className="room-detail__amenity-price">
                              {Number(amenity.price).toLocaleString()} vnđ
                            </div>
                          )}
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p>Không có tiện ích nào được thêm vào phòng này.</p>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default RoomDetail;