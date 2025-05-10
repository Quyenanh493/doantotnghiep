import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('http://localhost:8080/api/v1/amenities');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      title: 'Danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mã số',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => text || 'Không có mô tả',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status ? <Tag color="success">Kích hoạt</Tag> : <Tag color="error">Tạm khóa</Tag>
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

  const filteredData = categories.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="categories-page">
      <Card 
        title="Danh sách danh mục" 
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm mới
          </Button>
        }
      >
        <div className="table-actions">
          <Input
            placeholder="Tìm kiếm theo tên danh mục"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300, marginBottom: 16 }}
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
            showTotal: (total) => `Tổng cộng ${total} mục`,
          }}
        />
      </Card>
    </div>
  );
}

export default Categories; 