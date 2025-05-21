import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Card, Tag, Modal, Form, InputNumber, Switch, message, Descriptions, Upload } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  UploadOutlined,
  EyeOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { getAllAmenities, getAmenityById, createAmenity, updateAmenity, deleteAmenity } from '../../services/amenitiesService';
import { uploadImage } from '../../services/uploadImageService';
import { usePermissions } from '../../contexts/PermissionContext';
import './Amenities.scss';

const { confirm } = Modal;
const { TextArea } = Input;

function Amenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [currentAmenity, setCurrentAmenity] = useState(null);
  const [form] = Form.useForm();
  const [iconUrl, setIconUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // Get permission utilities
  const { canCreate, canUpdate, canDelete, isLoading: permissionLoading } = usePermissions();
  const hasCreatePermission = canCreate('amenities');
  const hasUpdatePermission = canUpdate('amenities');
  const hasDeletePermission = canDelete('amenities');

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const response = await getAllAmenities();
      if (response && response.DT) {
        setAmenities(response.DT);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
      message.error('Không thể tải danh sách tiện nghi');
    } finally {
      setLoading(false);
    }
  };

  const showAddEditModal = (amenity = null) => {
    setCurrentAmenity(amenity);
    setIsModalVisible(true);
    
    if (amenity) {
      form.setFieldsValue({
        amenitiesName: amenity.amenitiesName,
        description: amenity.description,
        price: amenity.price,
        amenitiesStatus: amenity.amenitiesStatus
      });
      setIconUrl(amenity.icon || '');
    } else {
      form.resetFields();
      setIconUrl('');
    }
  };

  const showViewModal = async (amenityId) => {
    try {
      setLoading(true);
      const response = await getAmenityById(amenityId);
      if (response && response.DT) {
        setCurrentAmenity(response.DT);
        setIsViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching amenity details:', error);
      message.error('Không thể tải thông tin chi tiết tiện nghi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentAmenity(null);
    form.resetFields();
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setCurrentAmenity(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const amenityData = {
        ...values,
        icon: iconUrl
      };

      let response;
      if (currentAmenity) {
        response = await updateAmenity(currentAmenity.amenitiesId, amenityData);
        message.success('Cập nhật tiện nghi thành công');
      } else {
        response = await createAmenity(amenityData);
        message.success('Thêm tiện nghi mới thành công');
      }

      setIsModalVisible(false);
      fetchAmenities();
    } catch (error) {
      console.error('Error saving amenity:', error);
      message.error('Lỗi khi lưu thông tin tiện nghi');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (amenityId, amenityName) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tiện nghi này?',
      icon: <ExclamationCircleOutlined />,
      content: `Tiện nghi: ${amenityName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteAmenity(amenityId);
          message.success('Xóa tiện nghi thành công');
          fetchAmenities();
        } catch (error) {
          console.error('Error deleting amenity:', error);
          message.error('Không thể xóa tiện nghi');
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = amenities.filter(item =>
    item.amenitiesName?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Xử lý upload ảnh icon
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ chấp nhận file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const customUpload = async ({ file, onSuccess, onError }) => {
    setUploadLoading(true);
    try {
      const url = await uploadImage(file);
      setIconUrl(url);
      onSuccess();
    } catch (error) {
      console.error('Error uploading image:', error);
      onError();
    } finally {
      setUploadLoading(false);
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
      title: 'Tên tiện nghi',
      dataIndex: 'amenitiesName',
      key: 'amenitiesName',
      sorter: (a, b) => a.amenitiesName.localeCompare(b.amenitiesName),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN').format(price || 0),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'amenitiesStatus',
      key: 'amenitiesStatus',
      render: (status) => (
        status ? <Tag color="success">Hoạt động</Tag> : <Tag color="error">Không hoạt động</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showViewModal(record.amenitiesId)}
          />
          {hasUpdatePermission && (
            <Button 
              type="default" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => showAddEditModal(record)}
            />
          )}
          {hasDeletePermission && (
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => showDeleteConfirm(record.amenitiesId, record.amenitiesName)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="amenities-page">
      <Card 
        title="Danh sách tiện nghi" 
        extra={
          hasCreatePermission && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showAddEditModal()}>
              Thêm mới
            </Button>
          )
        }
      >
        <div className="table-actions">
          <Input
            placeholder="Tìm kiếm theo tên tiện nghi"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300, marginBottom: 16 }}
          />
        </div>
        <Table
          columns={columns.filter(col => {
            // Always show all columns except action if no permissions
            if (col.key !== 'action') return true;
            // Only show action column if user has at least one action permission
            return hasUpdatePermission || hasDeletePermission;
          })}
          dataSource={filteredData}
          rowKey="amenitiesId"
          loading={loading || permissionLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} tiện nghi`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa tiện nghi */}
      <Modal
        title={currentAmenity ? "Cập nhật tiện nghi" : "Thêm tiện nghi mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="amenitiesName"
            label="Tên tiện nghi"
            rules={[{ required: true, message: 'Vui lòng nhập tên tiện nghi' }]}
          >
            <Input placeholder="Nhập tên tiện nghi" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá tiện nghi' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="amenitiesStatus"
            label="Trạng thái"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
          </Form.Item>

          <Form.Item
            label="Icon"
          >
            <Upload
              name="icon"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={customUpload}
            >
              {iconUrl ? (
                <img src={iconUrl} alt="icon" style={{ width: '100%' }} />
              ) : (
                <div>
                  {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item className="form-actions">
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {currentAmenity ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết tiện nghi"
        visible={isViewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            Đóng
          </Button>,
          hasUpdatePermission && (
            <Button 
              key="edit" 
              type="primary" 
              onClick={() => {
                setIsViewModalVisible(false);
                showAddEditModal(currentAmenity);
              }}
            >
              Chỉnh sửa
            </Button>
          ),
        ].filter(Boolean)}
        width={700}
      >
        {currentAmenity && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên tiện nghi">{currentAmenity.amenitiesName}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{currentAmenity.description || 'Không có mô tả'}</Descriptions.Item>
            <Descriptions.Item label="Giá">{new Intl.NumberFormat('vi-VN').format(currentAmenity.price || 0)} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {currentAmenity.amenitiesStatus ? 'Hoạt động' : 'Không hoạt động'}
            </Descriptions.Item>
            {currentAmenity.icon && (
              <Descriptions.Item label="Icon">
                <img 
                  src={currentAmenity.icon} 
                  alt={currentAmenity.amenitiesName} 
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} 
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Amenities;
