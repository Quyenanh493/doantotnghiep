import { Layout } from "antd";
import "./LayoutDefault.css";
import logo from "../../Images/logo.png";
import logoFold from "../../Images/logo-fold.png";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const { Sider, Content } = Layout;

function LayoutDefault() {
    const [collapsed, setCollapsed] = useState(false);

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
                    </div>
                </header>
                <Layout>
                    <Sider 
                        width={250} 
                        collapsible 
                        collapsed={collapsed} 
                        trigger={null}
                        className="layout-sider"
                    >
                        <Sidebar />
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