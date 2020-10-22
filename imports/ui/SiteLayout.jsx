import React, { 
    Fragment,
    useState 
} from 'react';
  
import { useTracker } from 'meteor/react-meteor-data';
  

import { 
    Layout, 
    Menu, Link
} from 'antd';
  
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';

const {
    Header, 
    Sider, 
    Content
} = Layout;
 
  
export const SiteLayout = props => {
    const [collapsed, setCollapsed] = useState(false);
    
    toggle = () => {
        setCollapsed(!collapsed);
    };

    return (

        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <a href="/activities">Aktivitäten</a>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        <a href="/opinions">Gutachten</a>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        Aufgaben
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: this.toggle,
                    })}
                </Header>
                <Content className="site-layout-content">
                    { props.children }
                </Content>
            </Layout>
        </Layout>
    );
}
  
  