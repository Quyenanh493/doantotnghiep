import { Card, Row, Col } from 'antd';
import { DollarTwoTone, ContactsTwoTone, ProfileTwoTone } from '@ant-design/icons';
import './Dashboard.scss';
import Revenue from '../../components/Revenue';
import BookedCount from '../../components/BookedCount';
import RoomCount from '../../components/RoomCount';
import CustomerArea from '../../components/CustomerArea';
import HotelPie from '../../components/HotelPie';

function Dashboard() {
  return (
    <div className="dashboard-page">
      <Row gutter={[16, 16]} style={{ padding: '20px', backgroundColor: '#F9FBFD' }}>
        <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
          <Card bordered={false} className="dashboard-card">
            <div className="dashboard-card__content">
              <div className="dashboard-card__icon">
                <DollarTwoTone />
              </div>
              <div className="dashboard-card__info">
                <Revenue />
                <p>Tổng thu nhập</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
          <Card bordered={false} className="dashboard-card">
            <div className="dashboard-card__content">
              <div className="dashboard-card__icon">
                <ProfileTwoTone />
              </div>
              <div className="dashboard-card__info">
                <BookedCount />
                <p>Số lượng đơn đặt phòng</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xxl={8} xl={8} lg={24} xs={24}>
          <Card bordered={false} className="dashboard-card">
            <div className="dashboard-card__content">
              <div className="dashboard-card__icon">
                <ContactsTwoTone />
              </div>
              <div className="dashboard-card__info">
                <RoomCount />
                <p>Số lượng phòng</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ padding: '0 20px 20px', backgroundColor: '#F9FBFD' }}>
        <Col xxl={12} xl={24} lg={24} md={24} sm={24} xs={24}>
          <CustomerArea />
        </Col>
        <Col xxl={12} xl={24} lg={24} md={24} sm={24} xs={24}>
          <HotelPie />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;