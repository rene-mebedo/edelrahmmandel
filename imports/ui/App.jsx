import React, { 
  Fragment,
  useState 
} from 'react';

import { useTracker } from 'meteor/react-meteor-data';

import { 
  BrowserRouter as Router,
  Routes 
} from 'react-router-dom';

import { 
  Layout, 
  Menu,
  Spin
} from 'antd';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { LoginForm } from './LoginForm';

const {
  Header, 
  Sider, 
  Content
} = Layout;


export const App = () => {
  const currentUser = useTracker(() => Meteor.user());
  const [collapsed, setCollapsed] = useState(false);

  toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
      <Fragment> { 
        currentUser !== undefined ? 
          currentUser !== null ? (
            <Layout>
              <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item key="1" icon={<UserOutlined />}>
                    Aktivitäten
                  </Menu.Item>
                  <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    Gutachten
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
                <Content
                  className="site-layout-background"
                  style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                  }}
                >
                  Content
                </Content>
              </Layout>
            </Layout>
          ) : (
            <LoginForm />
        ) : (
          <Spin size="large" />
        )
      }
      </Fragment>
  );
}

