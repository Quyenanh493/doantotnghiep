import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Image } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Rooms.css';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('http://localhost:8080/api/v1/rooms');
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
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
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image) => (
        <Image 
          src={image || 'https://via.placeholder.com/100x70'} 
          alt="Room" 
          style={{ width: 100, height: 70, objectFit: 'cover' }}
          fallback="https://via.placeholder.com/100x70?text=No+Image"
        />
      ),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} VNĐ`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (capacity) => `${capacity} người`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status ? <Tag color="success">Khả dụng</Tag> : <Tag color="error">Không khả dụng</Tag>
      ),
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
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEdit(record)}
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

  const handleEdit = (record) => {
    console.log('Edit record', record);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log('Delete record with id:', id);
    // Implement delete functionality
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = rooms.filter(item => 
    item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.type?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="rooms-page">
      <Card 
        title={
          <Space>
            <HomeOutlined />
            <span>Quản lý phòng</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm phòng mới
          </Button>
        }
      >
        <div className="table-actions">
          <Input
            placeholder="Tìm kiếm theo tên hoặc loại phòng"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 400, marginBottom: 16 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} phòng`,
          }}
        />
      </Card>
    </div>
  );
}

export default Rooms; 