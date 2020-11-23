import React, { 
    Fragment,
    useState 
} from 'react';

import { ListActivities } from './ListActivities';

import { 
    Layout, 
    Menu,
    Badge
} from 'antd';
  
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';

import { useUserActivityCount } from '../client/trackers';

const {
    Header, 
    Sider, 
    Content
} = Layout;

export const SiteLayout = props => {
    const [collapsed, setCollapsed] = useState(false);
    const [activitiesCount, acLoading] = useUserActivityCount();

    toggle = () => {
        setCollapsed(!collapsed);
    };
    
    renderUserActivitiesMenuItem = () => {
        const UserActivitiesLink = () => "Aktivitäten"; //<a href="/activities">Aktivitäten</a>;

        let count = <ClockCircleOutlined style={{ color: '#f5222d' }} />;

        if (acLoading) {
            return (
                <Badge count={count} size="small" offset={[10, 0]}>
                    <UserActivitiesLink />
                </Badge>
            );
        }

        if (activitiesCount !== null && activitiesCount > 0) {
            return (
                <Badge count={activitiesCount} size="small" offset={[10, 0]}>
                    <UserActivitiesLink />
                </Badge>
            );
        }

        return <UserActivitiesLink />;
    }

    return (

        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                  }}
            >
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        { renderUserActivitiesMenuItem() }
                    </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        <a href="/opinions">Gutachten</a>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        Aufgaben
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200, marginRight: 300 }}>
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
            
            { !props.refOpinion ? null :
                <Sider 
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        right: 0,
                    }}
                    theme="light" width="300" collapsible collapsedWidth="0" reverseArrow
                >
                    
                    <ListActivities refOpinion={props.refOpinion} refDetail={props.refDetail} />
                </Sider>
            }
        </Layout>
    );
}
  
  