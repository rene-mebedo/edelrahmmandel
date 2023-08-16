import React from 'react';

import Dropdown from 'antd/lib/dropdown';
import Space from 'antd/lib/space';
import Avatar from 'antd/lib/avatar';

import { ModalChangePassword } from '../modals/ChangePassword';

import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

import { Link } from './Link';

export const UserMenu = ({ currentUser , hasAdminRole }) => {
    const { firstName, lastName } = currentUser && currentUser.userData || { firstName: '?', lastName: '?' };

    const handleUserMenuClick = ({ key }) => {
        //console.log( key );
        switch (key) {
            case "LOGOUT":
                Meteor.logout();
                break;
        }
    }

    let items = [
        {
            key: "PROFILE",
            label: (<a href="/profile">Mein Profil</a>)
        },
        {
            type: 'divider',
        },
        {
            key: "CHANGE-PASSWORD",
            label: (<ModalChangePassword currentUser={currentUser} />)
        },
        {
            type: 'divider',
        },
        {
            key: "LOGOUT",
            label: (<a><LogoutOutlined /> Abmelden</a>)
        }
    ];
    if ( hasAdminRole ) {
        // Benutzer hat Admin-Rechte.
        items = items.concat([
            {
                type: 'divider',
            },
            {
                key: "ADMIN",
                //label: (<a><UsersAdminForm currentUser={currentUser} /> Administration</a>)
                label: (<Link href="/usersAdmin">Administration</Link>)
            }
        ]);
    }

    const menuProps = {
        items,
        onClick: handleUserMenuClick
    };

    return (
        <div className="mbac-usermenu">
            <Dropdown menu={menuProps} trigger={['click']} placement="bottomRight" arrow>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()} >
                    <Space>
                        <Avatar style={{ backgroundColor: 'orange', color: '#fff', verticalAlign: 'middle' }} /*size="large" gap={16}*/>
                            { firstName && firstName.length > 0
                                ? firstName.substring(0,1) + lastName.substring(0,1)
                                : lastName.substring(0,2)
                            }
                        </Avatar>
                        <div className="mbac-username">
                            { firstName + ' ' + lastName }
                        </div>
                    </Space>
                </a>
            </Dropdown>
        </div>
    )
}
