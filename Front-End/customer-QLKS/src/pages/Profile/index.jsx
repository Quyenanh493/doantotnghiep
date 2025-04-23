import { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Avatar, Upload, Card, Row, Col, Typography, Spin, notification } from 'antd';
import { UserOutlined, UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { updateCustomerProfile } from '../../services/customerService';
import './Profile.scss';

const { Title } = Typography;

function Profile() {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [notiApi, contextHolder] = notification.useNotification(); // Thêm khai báo notification API  

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData(user);

    // Điền thông tin vào form
    if (user) {
      form.setFieldsValue({
        customerName: user.customerName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        idNumber: user.idNumber,
        birthday: user.birthday ? dayjs(user.birthday) : null,
      });

      // Nếu có ảnh đại diện
      if (user.customerImage) {
        setImageUrl(user.customerImage);
      }
    }
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Lấy ID của khách hàng từ dữ liệu người dùng
      const customerId = userData.id || userData.customerId;

      if (!customerId) {
        notiApi.error({ // Sử dụng notiApi thay vì notification trực tiếp
          message: 'Lỗi',
          description: 'Không tìm thấy ID khách hàng!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
        setLoading(false);
        return;
      }

      // Format ngày sinh nếu có
      if (values.birthday?.format) {
        values.birthday = values.birthday.format('YYYY-MM-DD');
      }

      // Tạo đối tượng chỉ chứa các trường đã thay đổi
      const changedValues = {};
      const currentValues = form.getFieldsValue();

      // So sánh với dữ liệu ban đầu và chỉ lấy các trường đã thay đổi
      Object.keys(currentValues).forEach(key => {
        // Bỏ qua trường email vì nó bị disabled
        if (key === 'email') return;

        // Xử lý riêng cho trường ngày tháng
        if (key === 'birthday') {
          const formattedBirthday = currentValues[key]?.format('YYYY-MM-DD');
          const originalBirthday = userData.birthday ? dayjs(userData.birthday).format('YYYY-MM-DD') : null;

          if (formattedBirthday !== originalBirthday) {
            changedValues[key] = formattedBirthday;
          }
        }
        // Xử lý các trường thông thường
        else if (currentValues[key] !== userData[key]) {
          changedValues[key] = currentValues[key];
        }
      });

      // Nếu không có trường nào thay đổi
      if (Object.keys(changedValues).length === 0) {
        notiApi.info({ // Sử dụng notiApi thay vì notification trực tiếp
          message: 'Thông báo',
          description: 'Không có thông tin nào được thay đổi!',
        });
        setLoading(false);
        return;
      }

      console.log('Sending update request for customerId:', customerId);
      console.log('Changed data:', changedValues);

      // Gọi API cập nhật thông tin với ID khách hàng và chỉ gửi các trường đã thay đổi
      const response = await updateCustomerProfile(customerId, changedValues);

      if (response && response.EC === 0) {
        notiApi.success({ // Sử dụng notiApi thay vì notification trực tiếp
          message: 'Thành công',
          description: 'Cập nhật thông tin thành công!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });

        // Cập nhật thông tin trong localStorage
        const updatedUser = { ...userData, ...changedValues };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      } else {
        notiApi.error({ // Sử dụng notiApi thay vì notification trực tiếp
          message: 'Lỗi',
          description: response?.EM || 'Cập nhật thông tin thất bại!',
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
      }
    } catch (error) {
      console.error('Lỗi cập nhật thông tin:', error);
      notiApi.error({ // Sử dụng notiApi thay vì notification trực tiếp
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau!',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  if (!userData) {
    return <Spin size="large" tip="Đang tải..." />;
  }

  return (
    <>
      {contextHolder} {/* Thêm contextHolder vào đây để hiển thị thông báo */}
      <div className="profile-container">
        <Card className="profile-card">
          <Title level={2} className="profile-title">
            Thông Tin Cá Nhân
          </Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="avatar-section">
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  src={imageUrl}
                  className="profile-avatar"
                />

                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setImageUrl(e.target.result);
                    };
                    reader.readAsDataURL(file);
                    return false;
                  }}
                >
                  {uploadButton}
                </Upload>
                <div className="avatar-hint">
                  <Typography.Text type="secondary">
                    Nhấn vào nút trên để thay đổi ảnh đại diện
                  </Typography.Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="profile-form"
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="customerName"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                      <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}>
                      <Input placeholder="Nhập email" disabled />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phoneNumber"
                      label="Số điện thoại"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="idNumber"
                      label="Số CMND/CCCD"
                      rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD!' }]}>
                      <Input placeholder="Nhập số CMND/CCCD" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="birthday"
                      label="Ngày sinh"
                      rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                      <DatePicker
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày sinh" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                      <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="update-button">
                    Cập Nhật Thông Tin
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default Profile;
