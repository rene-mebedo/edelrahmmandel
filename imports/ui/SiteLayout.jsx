import React, { 
    Fragment,
    useState 
} from 'react';

import { ListActivities } from './ListActivities';

import { 
    Layout, 
    Menu,
    Badge,
    Avatar,
    Space,
    Dropdown
} from 'antd';
  
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    ClockCircleOutlined,
    DownOutlined
} from '@ant-design/icons';

import { useUserActivityCount } from '../client/trackers';
import { UserActivitiesDrawer } from './components/UserActivitiesDrawer';

import { UserMenu } from './components/UserMenu';
import { Link } from './components/Link';

const {
    Header, 
    Sider, 
    Content
} = Layout;

export const SiteLayout = props => {
    const [menuCollapsed, setMenuCollapsed] = useState(window.innerWidth < 600);
    const [activitiesCollapsed, setActivitiesCollapsed] = useState(window.innerWidth < 600);
    const [showUserActivies, setShowUserActivies] = useState(false);

    const [activitiesCount, acLoading] = useUserActivityCount();

    const toggleMenuSider = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    
    const toggleActivitiesSider = () => {
        setActivitiesCollapsed(!activitiesCollapsed);
    }

    onMenuClick = ({ item, key, keyPath, domEvent }) => {
        if (window.innerWidth < 600)
            setMenuCollapsed(!menuCollapsed);

        if (key == 'USERACTIVITIES') {
            return setShowUserActivies(true);
        }
    }

    closeUserActivities = () => {
        setShowUserActivies(false);
    }

    renderUserActivitiesMenuItem = () => {
        const UserActivitiesLink = () => "Aktivitäten";

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
            <Sider theme="dark" trigger={null} collapsible collapsed={menuCollapsed} collapsedWidth="0"
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                  }}
            >
                <div className="mbac-logo" >
                    <img className="large" src="/MEBEDO_LOGO_PRINT_RGB-300x88.jpg" />
                </div>

                <Menu 
                    theme="dark" mode="inline"
                    selectedKeys={ props.activeMenuKey ? [props.activeMenuKey]: []}
                    onClick={onMenuClick}
                >
                    <Menu.Item key="USERACTIVITIES" icon={<UserOutlined />}>
                        { renderUserActivitiesMenuItem() }
                    </Menu.Item>
                    <Menu.Item key="OPINIONS" icon={<VideoCameraOutlined />}>
                        <Link href="/opinions" canCancel>Gutachten</Link>
                    </Menu.Item>
                    <Menu.Item key="TASKS" icon={<UploadOutlined />}>
                        <Link href="/tasks" canCancel>Aufgaben</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout className="site-layout" style={{ marginLeft: menuCollapsed ? 0:200, marginRight: activitiesCollapsed ? 0:(props.refOpinion ? 300:0) }}>
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {
                        React.createElement(menuCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: toggleMenuSider
                        })
                    }
                    
                    { !props.refOpinion || !activitiesCollapsed ? null :
                        React.createElement(activitiesCollapsed ? MenuFoldOutlined : MenuUnfoldOutlined , {
                            className: 'trigger',
                            onClick: toggleActivitiesSider,
                            style: {float:'right'}
                        })
                    }

                    <UserMenu currentUser={props.currentUser} />

                </Header>
                <Content className="site-layout-content">
                    { props.children }
                </Content>
                
            </Layout>
            
            { !props.refOpinion 
                ? null 
                : <Sider 
                    style={{
                        overflow: 'hidden auto',
                        height: '100vh',
                        position: 'fixed',
                        right: 0,
                    }}
                    theme="light" width="300" collapsible collapsed={activitiesCollapsed} collapsedWidth="0"
                >
                    
                    <ListActivities 
                        onClose={ toggleActivitiesSider }
                        refOpinion={props.refOpinion} 
                        refDetail={props.refDetail} 
                        currentUser={props.currentUser} 
                    />
                </Sider>
            }

            <UserActivitiesDrawer 
                visible={ showUserActivies }
                onClose={ closeUserActivities }
            />
        </Layout>
    );
}
  
  