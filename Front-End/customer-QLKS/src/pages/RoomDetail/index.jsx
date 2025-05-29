import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Rate, Divider, Spin, Image, Tag, List, Typography, Avatar, Carousel, Modal } from 'antd';
import { WifiOutlined, CoffeeOutlined, CarOutlined, ShoppingOutlined, UserOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getRoomById } from '../../services/roomService';
import { getAmenityByRoomId } from '../../services/amenitiesService'; 
import { getRoomReviewsByRoomId } from '../../services/roomReviewService';
import dayjs from 'dayjs';
import './RoomDetail.scss';

const { Title, Text, Paragraph } = Typography;

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

// Function to parse roomImages from JSON string to array
const parseRoomImages = (roomImages, fallbackImage) => {
  if (!roomImages) return fallbackImage ? [fallbackImage] : [];
  
  try {
    const parsed = JSON.parse(roomImages);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    console.log('Error parsing roomImages:', error);
  }
  
  // Fallback to single image if parsing fails or array is empty
  return fallbackImage ? [fallbackImage] : [];
};

function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomImages, setRoomImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin phòng
        const roomResponse = await getRoomById(roomId);
        if (roomResponse && roomResponse.DT) {
          setRoom(roomResponse.DT);
          // Parse room images
          const images = parseRoomImages(roomResponse.DT.roomImages, roomResponse.DT.roomImage);
          setRoomImages(images);
        }
        
        // Lấy tiện ích của phòng
        const amenitiesResponse = await getAmenityByRoomId(roomId);
        if (amenitiesResponse && amenitiesResponse.DT) {
          setAmenities(amenitiesResponse.DT);
        }
        
        // Lấy đánh giá của phòng
        const reviewsResponse = await getRoomReviewsByRoomId(roomId);
        if (reviewsResponse && reviewsResponse.DT) {
          setReviews(reviewsResponse.DT);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin phòng:', error);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetail();
    }
  }, [roomId]);

  const handleImageClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

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
                  <Rate disabled defaultValue={room.averageRating || 0} allowHalf />
                  <span className="room-detail__rating-text">{room.averageRating || 0}/5 ({room.totalReview || 0} đánh giá)</span>
                </div>
                <div className="room-detail__price">
                  <Text strong>{Number(room.price).toLocaleString()} vnđ</Text> / đêm
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24}>
            <div className="room-detail__image-gallery">
              {roomImages.length > 0 ? (
                <div className="room-detail__gallery-container">
                  {/* Main Image Display */}
                  <div className="room-detail__main-image-container">
                    <img
                      className="room-detail__main-image"
                      src={roomImages[currentImageIndex]}
                      alt={`${room.roomName} - Ảnh ${currentImageIndex + 1}`}
                      onClick={handleImageClick}
                    />
                    
                    {/* Navigation arrows for main image */}
                    {roomImages.length > 1 && (
                      <>
                        <div 
                          className="room-detail__image-nav room-detail__image-nav--prev"
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === 0 ? roomImages.length - 1 : prev - 1
                          )}
                        >
                          <LeftOutlined />
                        </div>
                        <div 
                          className="room-detail__image-nav room-detail__image-nav--next"
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === roomImages.length - 1 ? 0 : prev + 1
                          )}
                        >
                          <RightOutlined />
                        </div>
                      </>
                    )}
                    
                    {/* Image counter */}
                    <div className="room-detail__image-counter">
                      {currentImageIndex + 1} / {roomImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {roomImages.length > 1 && (
                    <div className="room-detail__thumbnails">
                      <Row gutter={[8, 8]}>
                        {roomImages.map((image, index) => (
                          <Col xs={6} sm={4} md={3} key={index}>
                            <div 
                              className={`room-detail__thumbnail ${
                                index === currentImageIndex ? 'room-detail__thumbnail--active' : ''
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            >
                              <img
                                src={image}
                                alt={`${room.roomName} - Thumbnail ${index + 1}`}
                                className="room-detail__thumbnail-image"
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </div>
              ) : (
                <div className="room-detail__no-image">
                  <div className="room-detail__no-image-placeholder">
                    <Image 
                      src="https://via.placeholder.com/800x400?text=No+Image+Available"
                      alt="No image available"
                      preview={false}
                    />
                  </div>
                </div>
              )}
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

          <Col xs={24}>
            <Divider />
            <div className="room-detail__reviews">
              <h2 className="room-detail__section-title">Đánh giá từ khách hàng</h2>
              {reviewsLoading ? (
                <div className="room-detail__reviews-loading">
                  <Spin size="small" tip="Đang tải đánh giá..." />
                </div>
              ) : reviews.length > 0 ? (
                <List
                  className="room-detail__reviews-list"
                  itemLayout="horizontal"
                  dataSource={reviews}
                  renderItem={review => (
                    <List.Item className="room-detail__review-item">
                      <div className="room-detail__review-content">
                        <div className="room-detail__review-header">
                          <Avatar icon={<UserOutlined />} />
                          <div className="room-detail__review-author">
                            <div>{review.Customer?.customerName || 'Khách hàng'}</div>
                            <div className="room-detail__review-date">
                              {dayjs(review.createdAt).format('DD/MM/YYYY')}
                            </div>
                          </div>
                        </div>
                        <div className="room-detail__review-rating">
                          <Rate disabled value={review.rating} />
                          <span>{review.rating}/5</span>
                        </div>
                        <Paragraph>{review.comment}</Paragraph>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <p>Chưa có đánh giá nào cho phòng này.</p>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Image Preview Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={roomImages[currentImageIndex]}
            alt={`${room.roomName} - Ảnh ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
          
          {/* Navigation in modal */}
          {roomImages.length > 1 && (
            <>
              <div 
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 1000
                }}
                onClick={() => setCurrentImageIndex(prev => 
                  prev === 0 ? roomImages.length - 1 : prev - 1
                )}
              >
                <LeftOutlined />
              </div>
              <div 
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 1000
                }}
                onClick={() => setCurrentImageIndex(prev => 
                  prev === roomImages.length - 1 ? 0 : prev + 1
                )}
              >
                <RightOutlined />
              </div>
            </>
          )}
          
          {/* Image counter in modal */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {currentImageIndex + 1} / {roomImages.length}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RoomDetail;