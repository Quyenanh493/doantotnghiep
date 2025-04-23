import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Input, Select, Divider, Tag, Pagination, Spin, Typography } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getAllAmenities, searchAmenities, getAmenitiesByCategory, addAmenityToCart } from '../../services/amenitiesService';
import './Amenities.scss';

const { Title, Paragraph } = Typography;
const { Option } = Select;

function Amenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });

  // Lấy dữ liệu tiện nghi từ API thông qua service
  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const response = await getAllAmenities();
      if (response && response.DT) {
        setAmenities(response.DT);
        setPagination(prev => ({
          ...prev,
          total: response.DT.length
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tiện nghi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  // Xử lý thay đổi danh mục
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    
    try {
      let response;
      if (category === 'all') {
        response = await getAllAmenities();
      } else {
        response = await getAmenitiesByCategory(category);
      }
      
      if (response && response.DT) {
        setAmenities(response.DT);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: response.DT.length
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lọc tiện nghi theo danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = async () => {
    if (!searchText.trim()) {
      fetchAmenities();
      return;
    }
    
    setLoading(true);
    try {
      const response = await searchAmenities(searchText);
      if (response && response.DT) {
        setAmenities(response.DT);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: response.DT.length
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm tiện nghi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (amenityId) => {
    try {
      const response = await addAmenityToCart(amenityId, 1);
      if (response && response.EC === 0) {
        // Hiển thị thông báo thành công
        console.log('Đã thêm tiện nghi vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi khi thêm tiện nghi vào giỏ hàng:', error);
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // Lấy dữ liệu cho trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return amenities.slice(startIndex, endIndex);
  };

  return (
    <div className="amenities">
      <div className="amenities__header">
        <div className="amenities__title-container">
          <Title level={1} className="amenities__title">TIỆN NGHI</Title>
          <Paragraph className="amenities__subtitle">
            Khám phá các tiện nghi cao cấp của chúng tôi để nâng cao trải nghiệm lưu trú của bạn
          </Paragraph>
        </div>
      </div>

      <div className="amenities__search">
        <div className="amenities__search-container">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={16} lg={16}>
              <Input
                placeholder="Tìm kiếm tiện nghi..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
                className="amenities__search-input"
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Select
                defaultValue="all"
                style={{ width: '100%' }}
                onChange={handleCategoryChange}
                className="amenities__category-select"
              >
                <Option value="all">Tất cả danh mục</Option>
                <Option value="room">Tiện nghi phòng</Option>
                <Option value="bathroom">Phòng tắm</Option>
                <Option value="entertainment">Giải trí</Option>
                <Option value="service">Dịch vụ</Option>
              </Select>
            </Col>
          </Row>
        </div>
      </div>

      <div className="amenities__content">
        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            {getCurrentPageData().map(amenity => (
              <Col xs={24} sm={12} md={8} lg={6} key={amenity.id}>
                <Card 
                  className="amenities__card"
                  cover={
                    <div className="amenities__card-image">
                      <img 
                        alt={amenity.amenitiesName} 
                        src={amenity.icon || `https://via.placeholder.com/300x200?text=${encodeURIComponent(amenity.amenitiesName)}`} 
                      />
                    </div>
                  }
                  actions={[
                    <Button 
                      type="primary" 
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(amenity.id)}
                      className="amenities__card-btn"
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div className="amenities__card-header">
                        <span className="amenities__card-name">{amenity.amenitiesName}</span>
                        <span className="amenities__card-price">{Number(amenity.price).toLocaleString()} vnđ</span>
                      </div>
                    }
                    description={
                      <div className="amenities__card-description">
                        <Paragraph ellipsis={{ rows: 2 }}>
                          {amenity.description || 'Không có mô tả'}
                        </Paragraph>
                        {amenity.amenitiesStatus ? (
                          <Tag color="success">Có sẵn</Tag>
                        ) : (
                          <Tag color="error">Không có sẵn</Tag>
                        )}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </div>

      <div className="amenities__pagination">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={amenities.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={['12', '24', '36', '48']}
        />
      </div>
    </div>
  );
}

export default Amenities;