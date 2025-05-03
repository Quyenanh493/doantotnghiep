import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Rate, Divider, Spin, Image } from 'antd';
import { getRoomById } from '../../services/roomService';
import './RoomDetail.scss';

function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        const response = await getRoomById(roomId);
        if (response && response.DT) {
          setRoom(response.DT);
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
              <div className="room-detail__rating">
                <Rate disabled defaultValue={room.roomStar || 0} allowHalf />
                <span className="room-detail__rating-text">{room.roomStar || 0}/5</span>
              </div>
            </div>
          </Col>
          
          <Col xs={24}>
            <div className="room-detail__image-container">
              <Image
                className="room-detail__image"
                src={room.roomImage ? `http://localhost:6969/images/${room.roomImage}` : 'https://via.placeholder.com/800x500'}
                alt={room.roomName}
                preview={true}
              />
            </div>
          </Col>
          
          <Col xs={24}>
            <Divider />
            <div className="room-detail__description">
              <h2 className="room-detail__section-title">Mô tả phòng</h2>
              <p className="room-detail__description-text">
                {room.description || 'Phòng sang trọng với đầy đủ tiện nghi hiện đại, không gian thoáng đãng và view đẹp. Phòng được thiết kế theo phong cách hiện đại, tạo cảm giác thoải mái và ấm cúng cho khách hàng. Đây là lựa chọn hoàn hảo cho kỳ nghỉ của bạn.'}
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default RoomDetail;