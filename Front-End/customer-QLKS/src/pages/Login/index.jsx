import { Modal, Form, Input, Button, message, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { loginCustomer } from '../../services/logRegCusService';
import { setCookie, getCookie } from "../../helper/cookie";

function Login({ visible, onCancel, onLoginSuccess, onShowRegister }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notiApi, contextHolder] = notification.useNotification();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const loginData = {
        valueLogin: values.email, // hoặc số điện thoại
        password: values.password
      };
      const response = await loginCustomer(loginData);
      console.log('Login response:', response);
      
      // Kiểm tra cấu trúc dữ liệu mới
      if (response && response.EC === 0 && response.DT) {
        // Lưu token vào cookie
        setCookie("accessToken", response.DT.accessToken, 1);
        setCookie("refreshToken", response.DT.refreshToken, 1);
        setCookie("role", response.DT.accountType, 1);
        
        // Lưu thông tin người dùng vào localStorage
        const userData = response.DT.userData || {};
        localStorage.setItem('user', JSON.stringify(userData));
        
        notiApi.success({
          message: 'Đăng nhập thành công',
          description: response.EM || 'Chào mừng bạn đã quay trở lại!',
          duration: 3,
        });
        
        form.resetFields();
        
        // Gọi callback để cập nhật trạng thái đăng nhập trong LayoutDefault
        onLoginSuccess(userData);
        
        // Đóng modal đăng nhập
        if (onCancel) onCancel();
      } else {
        // Hiển thị thông báo lỗi từ API
        message.error(response?.EM || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Đăng Nhập"
        open={visible}
        onCancel={onCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          name="login_form"
          className="login-form"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item className="login-form-button">
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng Nhập
            </Button>
          </Form.Item>

          <div className="login-form-footer">
            <span>Chưa có tài khoản? </span>
            <Button type="link" onClick={() => {
              if (onShowRegister) {
                onShowRegister();
              } else {
                onCancel();
              }
            }}>
              Đăng ký ngay
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default Login;