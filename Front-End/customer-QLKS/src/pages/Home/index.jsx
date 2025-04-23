import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, DatePicker, Button, Layout, Row, Col } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import dayjs from 'dayjs';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import slide1 from "../../images/slide1.jpg"
import slide2 from "../../images/slide2.jpg"
import slide3 from "../../images/slide3.jpg"
import slide4 from "../../images/slide4.jpg"
import slide5 from "../../images/slide5.jpg"
import { setSearchDates, setGuestCounts } from '../../redux/search/searchSlice';
import "./Home.scss" 

const { Content } = Layout;

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State cho bộ chọn phòng và khách
  const [guestCounts, setGuestCountsState] = useState({
    rooms: 1,
    adults: 2,
    children: 0
  });
  const [guestSelectorVisible, setGuestSelectorVisible] = useState(false);
  const [dateIn, setDateIn] = useState(null);
  const [dateOut, setDateOut] = useState(null);

  // Xử lý thay đổi số lượng phòng và khách
  const handleGuestChange = (type, action) => {
    setGuestCountsState(prev => {
      const newCounts = { ...prev };
      
      if (action === 'increase') {
        newCounts[type] += 1;
      } else if (action === 'decrease') {
        newCounts[type] = Math.max(type === 'children' ? 0 : 1, newCounts[type] - 1);
      }
      
      return newCounts;
    });
  };

  // Tạo chuỗi hiển thị số phòng và khách
  const guestSummary = `${guestCounts.rooms} phòng, ${guestCounts.adults + guestCounts.children} khách`;

  // Xử lý khi chọn ngày nhận phòng
  const handleCheckInDateChange = (date) => {
    setDateIn(date);
  };

  // Xử lý khi chọn ngày trả phòng
  const handleCheckOutDateChange = (date) => {
    setDateOut(date);
  };

  // Hàm tạo giới hạn ngày cho DatePicker
  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  // Xử lý khi nhấn nút tìm phòng
  const handleSearchRooms = () => {
    if (!dateIn || !dateOut) {
      return;
    }

    // Lưu thông tin tìm kiếm vào Redux store
    dispatch(setSearchDates({
      dateIn: dateIn.format('YYYY-MM-DD'),
      dateOut: dateOut.format('YYYY-MM-DD')
    }));
    
    dispatch(setGuestCounts(guestCounts));

    // Chuyển hướng đến trang phòng
    navigate('/room');
  };

  const sliderData = [
    {
      id: 1,
      image: slide1,
    },
    {
      id: 2,
      image: slide2,
    },
    {
      id: 3,
      image: slide3,
    },
    {
      id: 4,
      image: slide4,
    },
    {
      id: 5,
      image: slide5,
    }
  ];

  return (
    <Layout className="home">
      <Content>
        <div className='home__section'>
          {/* Slider */}
          <Row>
            <Col span={24}>
              <div className="home__slider">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, EffectFade]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  effect="fade"
                  loop={true}
                  className="home__slider-main"
                >
                  {sliderData.map((slide) => (
                    <SwiperSlide key={slide.id}>
                      <div className="home__slider-item">
                        <img src={slide.image} alt={`Slide ${slide.id}`} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Col>
          </Row>

          {/* Tim phong */}
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={18}>
              <div className="home__hero">
                <div className="home__search-container">
                  <div className="home__search-title">Tìm Phòng</div>
                  <Form 
                    form={form}
                    layout="vertical" 
                    className="home__search-form"
                    onFinish={handleSearchRooms}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item 
                          label="Ngày Nhận Phòng" 
                          className="home__date-picker"
                          name="dateIn"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày nhận phòng!' }]}
                        >
                          <DatePicker 
                            format="DD/MM/YYYY" 
                            placeholder="dd/mm/yyyy" 
                            style={{ width: '100%' }} 
                            onChange={handleCheckInDateChange}
                            disabledDate={disabledDate}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item 
                          label="Ngày Trả Phòng" 
                          className="home__date-picker"
                          name="dateOut"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày trả phòng!' }]}
                        >
                          <DatePicker 
                            format="DD/MM/YYYY" 
                            placeholder="dd/mm/yyyy" 
                            style={{ width: '100%' }} 
                            onChange={handleCheckOutDateChange}
                            disabledDate={(current) => {
                              // Không cho phép chọn ngày trong quá khứ và trước ngày nhận phòng
                              return (current && current < dayjs().startOf('day')) || 
                                     (dateIn && current && current < dateIn);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item
                          label="Số phòng và khách"
                          name="guestInfo"
                          initialValue={guestSummary}
                          rules={[{ required: true, message: 'Vui lòng chọn số phòng và khách!' }]}
                        >
                          <div className="home__guest-selector">
                            <div 
                              className="home__guest-display"
                              onClick={() => setGuestSelectorVisible(!guestSelectorVisible)}
                            >
                              <span>{guestSummary}</span>
                            </div>
                            {guestSelectorVisible && (
                              <div className="home__guest-dropdown">
                                <div className="home__guest-item">
                                  <span className="home__guest-label">Phòng</span>
                                  <div className="home__guest-controls">
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('rooms', 'decrease')}
                                      disabled={guestCounts.rooms <= 1}
                                    >−</Button>
                                    <span className="home__guest-count">{guestCounts.rooms}</span>
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('rooms', 'increase')}
                                    >+</Button>
                                  </div>
                                </div>
                                <div className="home__guest-item">
                                  <span className="home__guest-label">Người lớn</span>
                                  <div className="home__guest-controls">
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('adults', 'decrease')}
                                      disabled={guestCounts.adults <= 1}
                                    >−</Button>
                                    <span className="home__guest-count">{guestCounts.adults}</span>
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('adults', 'increase')}
                                    >+</Button>
                                  </div>
                                </div>
                                <div className="home__guest-item">
                                  <span className="home__guest-label">Trẻ em</span>
                                  <div className="home__guest-controls">
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('children', 'decrease')}
                                      disabled={guestCounts.children <= 0}
                                    >−</Button>
                                    <span className="home__guest-count">{guestCounts.children}</span>
                                    <Button 
                                      className="home__guest-btn"
                                      onClick={() => handleGuestChange('children', 'increase')}
                                    >+</Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Form.Item label=" " className="home__search-button-wrapper">
                          <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="home__search-btn" 
                            style={{ width: '100%' }}
                          >
                            Tìm Phòng
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>

          {/* Phần còn lại của component giữ nguyên */}
          {/* Phòng nổi bật */}
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={18}>
              <div className="home__featured">
                <h2 className="home__featured-title">PHÒNG</h2>
                <Row gutter={[24, 24]}>
                  {/* Các thẻ phòng của bạn giữ nguyên */}
                  {/* ... */}
                </Row>
              </div>
            </Col>
          </Row>

          {/* Phần còn lại của component giữ nguyên không thay đổi */}
        </div>
      </Content>
    </Layout>
  )
}

export default Home;
