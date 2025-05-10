import { Menu } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  AppstoreOutlined,
  CreditCardOutlined,
  OrderedListOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  
  const items = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Quản lý Dashboard</Link>,
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: <Link to="/customers">Quản lý khách hàng</Link>,
    },
    {
      key: '/rooms',
      icon: <AppstoreOutlined />,
      label: <Link to="/rooms">Quản lý phòng</Link>,
    },
    {
      key: '/bookings',
      icon: <CreditCardOutlined />,
      label: <Link to="/bookings">Quản lý đặt phòng</Link>,
    },
    {
      key: '/categories',
      icon: <OrderedListOutlined />,
      label: <Link to="/categories">Danh sách danh mục</Link>,
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: <Link to="/users">Quản lý người dùng</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Quản lý cài đặt</Link>,
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