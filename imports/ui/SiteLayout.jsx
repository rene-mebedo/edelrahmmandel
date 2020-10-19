import React, { 
    Fragment,
    useState 
} from 'react';
  
import { useTracker } from 'meteor/react-meteor-data';
  
import { Routes, Route, Switch, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
  
import { 
    Layout, 
    Menu
} from 'antd';
  
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';

import { AktivitaetenForm } from './AktivitaetenForm';
import { GutachtenForm } from './GutachtenForm';
  
const {
    Header, 
    Sider, 
    Content
} = Layout;
 
  
class SiteLayout extends React.Component {
    //const [collapsed, setCollapsed] = useState(false);

    toggle = () => {
        setCollapsed(!collapsed);
    };

    render() {
        return (

            <Layout>
                <Sider trigger={null} collapsible collapsed={false/*collapsed*/}>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            <Link to="activities">Aktivitäten</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                            <Link to="gutachten">Gutachten</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<UploadOutlined />}>
                            Aufgaben
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        {React.createElement(false /*collapsed*/ ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: this.toggle,
                        })}
                    </Header>
                    <Content className="site-layout-content">
                        <Switch>
                            <Route path="/" element={<div>Akt</div>} />
                            <Route path="activities" element={<AktivitaetenForm />} />
                            <Route path="gutachten" element={<GutachtenForm />} />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(SiteLayout);
  
  