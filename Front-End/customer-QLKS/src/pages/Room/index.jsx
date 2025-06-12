import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, DatePicker, Form, Input, Select, Divider, Tag, Pagination, notification, Rate } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getAllRooms, checkRoomAvailability, searchAvailableRooms } from '../../services/roomService';
import { getAllAmenities, getAmenityByRoomId } from '../../services/amenitiesService';
import { getCities, getHotelsByCity } from '../../services/hotelService';
import './Room.scss';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetSearch } from '../../redux/search/searchSlice'; 
import { getCookie } from '../../helper/cookie';

const { RangePicker } = DatePicker;
const { Option } = Select;

function Room() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notiApi, contextHolder] = notification.useNotification();
  const [selectedDates, setSelectedDates] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // Lấy dữ liệu tìm kiếm từ Redux store
  const searchData = useSelector(state => state.search);
  
  // State cho bộ chọn khách
  const [guestCounts, setGuestCounts] = useState(searchData.guestCounts || {
    rooms: 1,
    adults: 2,
    children: 0
  });
  const [guestSelectorVisible, setGuestSelectorVisible] = useState(false);
  const [roomAmenities, setRoomAmenities] = useState({});

  // Xử lý thay đổi số lượng khách
  const handleGuestChange = (type, action) => {
    setGuestCounts(prev => {
      const newCounts = { ...prev };
      
      if (action === 'increase') {
        newCounts[type] += 1;
      } else if (action === 'decrease') {
        newCounts[type] = Math.max(type === 'children' ? 0 : 1, newCounts[type] - 1);
      }
      
      // Cập nhật giá trị vào form sau khi thay đổi
      form.setFieldsValue({
        guestInfo: `${newCounts.rooms} phòng, ${newCounts.adults + newCounts.children} khách`
      });
      
      return newCounts;
    });
  };

  // Tạo chuỗi hiển thị số phòng và khách
  const guestSummary = `${guestCounts.rooms} phòng, ${guestCounts.adults + guestCounts.children} khách`;
  
  // Lấy tiện nghi cho từng phòng
  const fetchRoomAmenities = async (roomId) => {
    try {
      const response = await getAmenityByRoomId(roomId);
      if (response && response.EC === 0) {
        return response.DT;
      }
      return [];
    } catch (error) {
      console.error(`Lỗi khi lấy tiện nghi cho phòng ${roomId}:`, error);
      return [];
    }
  };

  // Lấy tiện nghi cho tất cả các phòng hiện tại
  const fetchAllRoomAmenities = async (roomsData) => {
    if (!roomsData || roomsData.length === 0) return;
    
    const amenitiesMap = {};
    
    for (const room of roomsData) {
      const amenities = await fetchRoomAmenities(room.roomId);
      amenitiesMap[room.roomId] = amenities;
    }
    
    setRoomAmenities(amenitiesMap);
  };
  
  // Lấy dữ liệu phòng và tiện nghi từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy dữ liệu phòng
      const roomsResponse = await getAllRooms();
      
      // Lấy dữ liệu tiện nghi
      const amenitiesResponse = await getAllAmenities();
      
      // Lấy danh sách thành phố
      const citiesResponse = await getCities();
      
      if (roomsResponse && roomsResponse.DT) {
        // Hiển thị tất cả phòng có trạng thái available
        const availableRooms = roomsResponse.DT.filter(room => room.roomStatus === 'Available');
        
        setRooms(availableRooms);
        setAllRooms(roomsResponse.DT); // Lưu tất cả phòng để tham khảo
        setPagination(prev => ({
          ...prev,
          total: availableRooms.length
        }));
        
        // Lấy tiện nghi cho các phòng hiện tại
        await fetchAllRoomAmenities(availableRooms);
      }
      
      if (amenitiesResponse && amenitiesResponse.DT) {
        setAmenities(amenitiesResponse.DT);
      }

      if (citiesResponse && citiesResponse.DT) {
        setCities(citiesResponse.DT);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      notiApi.error({
        message: 'Lỗi',
        description: 'Không thể tải dữ liệu phòng. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn thành phố
  const handleCityChange = async (city) => {
    setSelectedCity(city);
    form.setFieldsValue({ hotel: undefined }); // Reset hotel selection
    
    if (city) {
      try {
        const hotelsResponse = await getHotelsByCity(city);
        if (hotelsResponse && hotelsResponse.DT) {
          setHotels(hotelsResponse.DT);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khách sạn:', error);
        notiApi.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách khách sạn.'
        });
      }
    } else {
      setHotels([]);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (searchData && searchData.dateIn && searchData.dateOut) {
      const dateIn = dayjs(searchData.dateIn);
      const dateOut = dayjs(searchData.dateOut);
      
      // Reset form trước khi cập nhật giá trị mới
      form.resetFields();
      
      form.setFieldsValue({
        dates: [dateIn, dateOut],
        guestInfo: `${searchData.guestCounts.rooms} phòng, ${searchData.guestCounts.adults + searchData.guestCounts.children} khách`,
        roomType: searchData.roomType || undefined,
        city: searchData.city || undefined,
        hotel: searchData.hotelId || undefined
      });
      
      setSelectedDates([dateIn, dateOut]);
      setGuestCounts(searchData.guestCounts);
      
      // Load hotels if city is available
      if (searchData.city) {
        handleCityChange(searchData.city);
      }
      
      // Thực hiện tìm kiếm với dữ liệu từ Redux
      handleSearch({
        dates: [dateIn, dateOut],
        guestInfo: `${searchData.guestCounts.rooms} phòng, ${searchData.guestCounts.adults + searchData.guestCounts.children} khách`,
        roomType: searchData.roomType || undefined,
        city: searchData.city || undefined,
        hotel: searchData.hotelId || undefined
      });
      
      // Đặt lại dữ liệu tìm kiếm trong Redux sau khi sử dụng
      dispatch(resetSearch());
    }
  }, []);

  // Lọc phòng dựa trên các tiêu chí tìm kiếm
  const handleSearch = async (values) => {
    setLoading(true);
    
    try {
      // Kiểm tra xem có chọn ngày không
      if (!values.dates || values.dates.length !== 2) {
        notiApi.warning({
          message: 'Thiếu thông tin',
          description: 'Vui lòng chọn ngày nhận và trả phòng.'
        });
        setLoading(false);
        return;
      }

      // Lấy thông tin tìm kiếm
      const dateIn = values.dates[0].format('YYYY-MM-DD');
      const dateOut = values.dates[1].format('YYYY-MM-DD');
      setSelectedDates(values.dates);
      
      // Lấy số lượng khách
      const guestCount = values.guestInfo ? (guestCounts.adults + guestCounts.children) : null;
      
      // Lấy thông tin city và hotel ID
      const city = values.city || null;
      const hotelId = values.hotel || null;
    
      // Gọi API tìm kiếm phòng trống
      console.log('Thông tin tìm kiếm:', {
        dateIn,
        dateOut,
        roomType: values.roomType || null,
        guestCount,
        city,
        hotelId
      });
      const response = await searchAvailableRooms(
        dateIn,
        dateOut,
        values.roomType || null,
        guestCount,
        city,
        hotelId
      );
      console.log('Dữ liệu trả về từ API:', response); 
      
      if (response && response.DT) {
        setRooms(response.DT);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: response.DT.length
        }));
        
        // Lấy tiện nghi cho các phòng tìm kiếm được
        await fetchAllRoomAmenities(response.DT);
        
        // Hiển thị thông báo nếu không tìm thấy phòng
        if (response.DT.length === 0) {
          notiApi.info({
            message: 'Không tìm thấy phòng',
            description: 'Không có phòng nào phù hợp với tiêu chí tìm kiếm của bạn.'
          });
        } else {
          // Hiển thị thông báo thành công
          const locationText = city ? ` tại ${city}` : '';
          const hotelText = hotelId && hotels.find(h => h.hotelId === hotelId) 
            ? ` trong khách sạn ${hotels.find(h => h.hotelId === hotelId).hotelName}` 
            : '';
          
          notiApi.success({
            message: 'Tìm kiếm thành công',
            description: `Tìm thấy ${response.DT.length} phòng${locationText}${hotelText}.`
          });
        }
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm phòng:', error);
      notiApi.error({
        message: 'Lỗi tìm kiếm',
        description: 'Đã xảy ra lỗi khi tìm kiếm phòng.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin chi tiết tiện nghi dựa trên ID
  const getAmenityDetails = (amenityId) => {
    return amenities.find(amenity => amenity.amenitiesId === amenityId) || null;
  };

  const handleBookNow = (roomId) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const token = getCookie('accessToken');
    if (!token) {
      notiApi.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để đặt phòng.'
      });
      return;
    }
    
    // Kiểm tra xem đã chọn ngày chưa
    if (!selectedDates || selectedDates.length !== 2) {
      notiApi.warning({
        message: 'Chưa chọn ngày',
        description: 'Vui lòng chọn ngày nhận phòng và trả phòng trước khi đặt.'
      });
      return;
    }
    
    // Chuyển hướng đến trang đặt phòng với thông tin đã chọn
    navigate(`/booking-confirmation`, {
      state: {
        roomId: roomId,
        dateIn: selectedDates[0].format('YYYY-MM-DD'),
        dateOut: selectedDates[1].format('YYYY-MM-DD'),
        adults: guestCounts.adults,
        childrens: guestCounts.children,
        roomCount: guestCounts.rooms
      }
    });
  };

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
    if (!Array.isArray(rooms)) {
      return [];
    }
    
    return rooms.slice(startIndex, endIndex);
  };

  // Hàm tạo giới hạn ngày cho DatePicker
  const disabledDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ
    return current && current < dayjs().startOf('day');
  };

  const handleViewDetail = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  return (
    <div className="room">
      {contextHolder}
      <div className="room__header">
        <div className="room__title-container">
          <h1 className="room__title">PHÒNG</h1>
        </div>
      </div>

      <div className="room__search">
        <div className="room__search-container">
          <Form
            form={form}
            name="room_search"
            onFinish={handleSearch}
            layout="vertical"
            className="room__search-form"
          >
            {/* Dòng 1: Thành phố và Khách sạn */}
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="city"
                  label="Thành phố"
                >
                  <Select
                    placeholder="Chọn thành phố"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={handleCityChange}
                    size="large"
                  >
                    {cities.map(city => (
                      <Option key={city} value={city}>{city}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="hotel"
                  label="Khách sạn"
                >
                  <Select
                    placeholder="Chọn khách sạn"
                    style={{ width: '100%' }}
                    allowClear
                    disabled={!selectedCity}
                    size="large"
                  >
                    {hotels.map(hotel => (
                      <Option key={hotel.hotelId} value={hotel.hotelId}>
                        {hotel.hotelName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Dòng 2: Ngày nhận phòng, trả phòng, số phòng khách, loại phòng */}
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  name="dates"
                  label="Ngày nhận phòng, ngày trả phòng"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                  <RangePicker 
                    className="room__date-picker"
                    format="DD/MM/YYYY"
                    placeholder={['Ngày Nhận Phòng', 'Ngày Trả Phòng']}
                    style={{ width: '100%' }}
                    disabledDate={disabledDate}
                    onChange={(dates) => setSelectedDates(dates)}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  label="Số phòng và khách"
                  name="guestInfo"
                  initialValue={guestSummary}
                  rules={[{ required: true, message: 'Vui lòng chọn số phòng và khách!' }]}
                >
                  <div className="room__guest-selector">
                    <div 
                      className="room__guest-display room__guest-display--large"
                      onClick={() => setGuestSelectorVisible(!guestSelectorVisible)}
                    >
                      <span>{guestSummary}</span>
                    </div>
                    {guestSelectorVisible && (
                      <div className="room__guest-dropdown">
                        <div className="room__guest-item">
                          <span className="room__guest-label">Phòng</span>
                          <div className="room__guest-controls">
                            <Button 
                              className="room__guest-btn"
                              onClick={() => handleGuestChange('rooms', 'decrease')}
                              disabled={guestCounts.rooms <= 1}
                            >−</Button>
                            <span className="room__guest-count">{guestCounts.rooms}</span>
                            <Button 
                              className="room__guest-btn"
                              onClick={() => handleGuestChange('rooms', 'increase')}
                            >+</Button>
                          </div>
                        </div>
                        <div className="room__guest-item">
                          <span className="room__guest-label">Người lớn</span>
                          <div className="room__guest-controls">
                            <Button 
                              className="room__guest-btn"
                              onClick={() => handleGuestChange('adults', 'decrease')}
                              disabled={guestCounts.adults <= 1}
                            >−</Button>
                            <span className="room__guest-count">{guestCounts.adults}</span>
                            <Button 
                              className="room__guest-btn"
                              onClick={() => handleGuestChange('adults', 'increase')}
                            >+</Button>
                          </div>
                        </div>
                        <div className="room__guest-item">
                          <span className="room__guest-label">Trẻ em</span>
                          <div className="room__guest-controls">
                            <Button 
                              className="room__guest-btn"
                              onClick={() => handleGuestChange('children', 'decrease')}
                              disabled={guestCounts.children <= 0}
                            >−</Button>
                            <span className="room__guest-count">{guestCounts.children}</span>
                            <Button 
                              className="room__guest-btn"
                              onClick={() => handleGuestChange('children', 'increase')}
                            >+</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item
                  name="roomType"
                  label="Loại phòng"
                >
                  <Select
                    placeholder="Chọn Loại phòng"
                    style={{ width: '100%' }}
                    allowClear
                    size="large"
                  >
                    {Array.from(new Set(allRooms.map(room => room.roomType)))
                      .filter(Boolean)
                      .map(type => (
                        <Option key={type} value={type}>{type}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Dòng 3: Nút tìm kiếm căn giữa */}
            <Row justify="center" style={{ marginTop: '24px' }}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                    className="room__search-btn room__search-btn--large"
                    loading={loading}
                    style={{ width: '100%', height: '48px', fontSize: '16px', fontWeight: '500' }}
                  >
                    Tìm Kiếm
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <div className="room__content">
        <Row gutter={[24, 24]}>
          {getCurrentPageData().map(room => (
            <Col xs={24} sm={24} md={12} lg={12} xl={12} key={room.roomId}>
              <Card className="room__card" loading={loading}>
                <div className="room__card-image">
                  <img src={room.roomImage} alt={room.roomName} />
                </div>
                <div className="room__card-info">
                  <div className="room__card-header">
                    <h2 className="room__card-name">{room.roomName}</h2>
                    <div className="room__card-price">{Number(room.price).toLocaleString()} vnđ mỗi đêm</div>
                  </div>
                  
                  {room.Hotel && (
                    <div className="room__card-hotel-info">
                      <h3 className="room__card-hotel-name">{room.Hotel.hotelName}</h3>
                      {room.Hotel.address && (
                        <div className="room__card-location">
                          <span className="room__card-location-icon">📍</span>
                          <span className="room__card-location-text">{room.Hotel.address}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="room__card-rating">
                    <Rate disabled value={room.averageRating || 0} allowHalf />
                    <span className="room__card-rating-text">
                      {room.averageRating || 0}/5 ({room.totalReview || 0} đánh giá)
                    </span>
                  </div>
                  
                  <Divider className="room__card-divider" />
                  
                  <div className="room__card-details">
                    <div className="room__card-features">
                      <h3>Tiện Nghi</h3>
                      <div className="room__card-features-list">
                        {roomAmenities[room.roomId] && roomAmenities[room.roomId].map((amenity, index) => (
                          <Tag key={index} className="room__card-feature-tag">
                            {amenity.amenitiesName}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    
                    <div className="room__card-capacity">
                      <h3>Sức Chứa</h3>
                      <div>Tối đa {room.maxCustomer} khách</div>
                    </div>
                    
                    <div className="room__card-type">
                      <h3>Loại Phòng</h3>
                      <div>{room.roomType}</div>
                    </div>
                  </div>
                  
                  <div className="room__card-actions">
                    <Button 
                      type="primary" 
                      className="room__card-btn"
                      onClick={() => handleBookNow(room.roomId)}
                    >
                      Đặt Ngay
                    </Button>
                    <Button 
                      type="default" 
                      className="room__card-btn room__card-btn--detail"
                      onClick={() => handleViewDetail(room.roomId)}
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      
      <div className="room__pagination">
        <Pagination 
          current={pagination.current} 
          pageSize={pagination.pageSize} 
          total={pagination.total} 
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>
    </div>
  );
}

export default Room;
