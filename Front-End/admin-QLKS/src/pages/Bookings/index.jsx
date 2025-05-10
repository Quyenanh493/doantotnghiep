import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, DatePicker } from 'antd';
import { SearchOutlined, CalendarOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Bookings.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const { RangePicker } = DatePicker;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('http://localhost:8080/api/v1/bookings');
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã đặt phòng',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Ngày nhận phòng',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.checkIn) - new Date(b.checkIn),
    },
    {
      title: 'Ngày trả phòng',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `${amount?.toLocaleString()} VNĐ`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let text = 'Không xác định';
        
        switch(status) {
          case 'CONFIRMED':
            color = 'success';
            text = 'Đã xác nhận';
            break;
          case 'PENDING':
            color = 'warning';
            text = 'Đang chờ';
            break;
          case 'CANCELLED':
            color = 'error';
            text = 'Đã hủy';
            break;
          case 'COMPLETED':
            color = 'blue';
            text = 'Hoàn thành';
            break;
          default:
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Đã xác nhận', value: 'CONFIRMED' },
        { text: 'Đang chờ', value: 'PENDING' },
        { text: 'Đã hủy', value: 'CANCELLED' },
        { text: 'Hoàn thành', value: 'COMPLETED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            shape="circle" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => handleView(record)}
          />
          <Button 
            type="primary" 
            danger 
            shape="circle" 
            icon={<DeleteOutlined />} 
            size="small" 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    console.log('View booking details', record);
    // Implement view functionality
  };

  const handleDelete = (id) => {
    console.log('Delete booking with id:', id);
    // Implement delete functionality
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const filteredData = bookings.filter(item => {
    // Text search filter
    const textMatch = item.bookingCode?.toLowerCase().includes(searchText.toLowerCase()) ||
                      item.customerName?.toLowerCase().includes(searchText.toLowerCase());
    
    // Date range filter
    let dateMatch = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const bookingDate = new Date(item.checkIn);
      dateMatch = bookingDate >= dateRange[0].toDate() && bookingDate <= dateRange[1].toDate();
    }
    
    return textMatch && dateMatch;
  });

  return (
    <div className="bookings-page">
      <Card 
        title={
          <Space>
            <CalendarOutlined />
            <span>Quản lý đặt phòng</span>
          </Space>
        }
      >
        <div className="table-actions">
          <Space>
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên khách hàng"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
            <RangePicker 
              onChange={handleDateRangeChange}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} đơn đặt phòng`,
          }}
        />
      </Card>
    </div>
  );
}

export default Bookings; 