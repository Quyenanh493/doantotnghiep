import { Menu } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  AppstoreOutlined,
  CreditCardOutlined,
  ClusterOutlined,
  TeamOutlined,
  SignatureOutlined,
  AppstoreAddOutlined,
  PlusSquareOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';

function Sidebar() {
  const location = useLocation();
  
  const items = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Quản lý Dashboard</Link>,
    },
    {
      key: '/hotel',
      icon: <UserOutlined />,
      label: <Link to="/hotel">Quản lý khách sạn</Link>,
    },
    {
      key: '/account',
      icon: <UserOutlined />,
      label: <Link to="/account">Quản lý tài khoản</Link>,
    },
    {
      key: '/user',
      icon: <TeamOutlined />,
      label: <Link to="/user">Quản lý nhân sự</Link>,
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: <Link to="/customers">Quản lý khách hàng</Link>,
    },
    {
      key: '/bookings-management',
      icon: <AppstoreAddOutlined />,
      label: <span style={{ fontSize: "14px" }}>Quản lý đặt phòng</span>,
      children: [
        {
          key: '/bookings/room',
          icon: <AppstoreOutlined />,
          label: <Link to="/bookings/room">Phòng</Link>,
        },
        {
          key: '/bookings/factBooking',
          icon: <SignatureOutlined />,
          label: <Link to="/bookings/factBooking">Đơn đặt phòng</Link>,
        },
        {
          key: '/bookings/payment',
          icon: <CreditCardOutlined />,
          label: <Link to="/bookings/payment">Thanh toán</Link>,
        }
      ],
    },
    {
      key: '/amenities',
      icon: <PlusSquareOutlined />,
      label: <Link to="/amenities">Quản lý Tiện ích</Link>,
    },
    {
      key: '/permission',
      icon: <ClusterOutlined />,
      label: <Link to="/permission">Quản lý Quyền</Link>,
    },
  ];

  return (
    <div className="sidebar">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        className="sidebar-menu"
      />
    </div>
  );
}

export default Sidebar; 