import { Button, Layout, message } from "antd";
import "./LayoutDefault.css";
import logo from "../../Images/logo.png";
import logoFold from "../../Images/logo-fold.png";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import MenuSider from "../../components/MenuSider";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";

const { Sider, Content } = Layout;

function LayoutDefault() {
    const [collapsed, setCollapsed] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const accessToken = getCookie("accessToken");
    const role = getCookie("role");

    useEffect(() => {
        if (accessToken && role === "admin") {
            message.success("Đăng nhập thành công");
            setIsAuthenticated(true);
        }
    }, [accessToken, role]);

    const handleLogout = () => {
        navigate("/logout");
    };

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "admin") {
        return <Navigate to="/unauthorized" replace />;
    }

    if (!isAuthenticated) {
        return null; 
    }

    return (
        <>
            <Layout className="layout-default">
                <header className="header">
                    <div className={"header__logo " + (collapsed && "header__logo--collapsed")}>
                        <img src={collapsed ? logoFold : logo} alt="Logo" />
                    </div>
                    <div className="header__nav">
                        <div className="header__nav-left">
                            <div className="header__collapse" onClick={() => setCollapsed(!collapsed)}>
                                <MenuUnfoldOutlined />
                            </div>
                        </div>
                        <div className="header__nav-right">
                            <Button
                                style={{ backgroundColor: "blue", fontSize: "14px", color: "white" }}
                                type="primary"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                </header>
                <Layout>
                    <Sider className="sider" collapsed={collapsed} theme="light">
                        <MenuSider />
                    </Sider>
                    <Content className="content">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default LayoutDefault;