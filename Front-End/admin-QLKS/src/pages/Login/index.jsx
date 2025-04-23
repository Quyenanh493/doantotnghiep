import { Button, Form, Input, notification, Spin } from "antd";
import { useState } from "react";
import { setCookie } from "../../helpers/cookie";
import { login } from "../../services/loginService";
import { useNavigate } from "react-router-dom";
import './Login.css'; 

const { Password } = Input;

function Login() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [notiApi, contextHolder] = notification.useNotification();
    const [spinning, setSpinning] = useState(false);

    const handleLoginSubmit = async (values) => {
        setSpinning(true);
        try {
            const response = await login(values);
    
            if (response.accessToken) {
                setCookie("accessToken", response.accessToken, 1);
                setCookie("role", response.role, 1);
                notiApi.success({
                    message: "Đăng nhập thành công",
                    description: "Bạn đã đăng nhập thành công.",
                });
                navigate("/", { replace: true });             
            } else {
                notiApi.error({
                    message: "Đăng nhập thất bại",
                    description: "Thông tin đăng nhập không chính xác.",
                });
            }
        } catch (error) {
            notiApi.error({
                message: "Đăng nhập thất bại",
                description: "Thông tin đăng nhập không chính xác.",
            });
        } finally {
            setSpinning(false);
        }
    };
    

    return (
        <>
            {contextHolder}
            <Spin spinning={spinning}>
                <div className="login-container">
                    <h1 className="login-title">Đăng nhập</h1>
                    <Form layout="vertical" name='Login' onFinish={handleLoginSubmit} form={form} className="login-form">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input placeholder="Nhập email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Password placeholder='Nhập password' />
                        </Form.Item>
                        <Form.Item>
                            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </>
    );
}

export default Login;