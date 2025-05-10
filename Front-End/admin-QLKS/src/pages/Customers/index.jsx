import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Customers.css';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('http://localhost:8080/api/v1/customers');
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
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
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => text || 'Chưa cập nhật',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Bị khóa</Tag>
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

  const filteredData = customers.filter(item => 
    item.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.phone?.includes(searchText)
  );

  return (
    <div className="customers-page">
      <Card 
        title={
          <Space>
            <UserOutlined />
            <span>Quản lý khách hàng</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm mới
          </Button>
        }
      >
        <div className="table-actions">
          <Input
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
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
            showTotal: (total) => `Tổng cộng ${total} khách hàng`,
          }}
        />
      </Card>
    </div>
  );
}

export default Customers; 