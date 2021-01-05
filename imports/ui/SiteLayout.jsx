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
import { UserActivitiesDrawer } from './components/UserActivitiesDrawer';

const {
    Header, 
    Sider, 
    Content
} = Layout;

export const SiteLayout = props => {
    const [menuCollapsed, setMenuCollapsed] = useState(window.innerWidth < 600);
    const [activitiesCollapsed, setActivitiesCollapsed] = useState(window.innerWidth < 600);
    const [showUserActivies, setShowUserActivies] = useState(false);
    //const [lastActiveMenuKey, setLastActiveMenuKey] = useState(props.activeMenuKey);

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
            //setLastActiveMenuKey(props.activeMenuKey);
            return setShowUserActivies(true);
        }
    }

    closeUserActivities = () => {
        //setLastActiveMenuKey(lastActiveMenuKey);
        setShowUserActivies(false);
    }

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
                    theme="dark" mode="inline" /*selectedKeys={ lastActiveMenuKey ? [lastActiveMenuKey]: [] }*/
                    selectedKeys={ props.activeMenuKey ? [props.activeMenuKey]: []}
                    onClick={onMenuClick}
                >
                    <Menu.Item key="USERACTIVITIES" icon={<UserOutlined />}>
                        { renderUserActivitiesMenuItem() }
                    </Menu.Item>
                    <Menu.Item key="OPINIONS" icon={<VideoCameraOutlined />}>
                        <a href="/opinions">Gutachten</a>
                    </Menu.Item>
                    <Menu.Item key="TASKS" icon={<UploadOutlined />}>
                        <a href="/tasks">Aufgaben</a>
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout className="site-layout" style={{ marginLeft: menuCollapsed ? 0:200, marginRight: activitiesCollapsed ? 0:300 }}>
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {
                        React.createElement(menuCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: toggleMenuSider
                        })
                    }
                    
                    {
                        React.createElement(activitiesCollapsed ? MenuFoldOutlined : MenuUnfoldOutlined , {
                            className: 'trigger',
                            onClick: toggleActivitiesSider,
                            style: {float:'right'}
                        })
                    }
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
                        onClose={ toggleActivitiesSider //e => setActivitiesCollapsed(false)
                        }
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
  
  