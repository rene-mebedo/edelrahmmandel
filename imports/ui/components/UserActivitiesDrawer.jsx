import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Modal,
    Tooltip,
    Drawer,
    Space,
    Comment,
    Avatar,
    List,
} from 'antd';

import { EyeOutlined, EyeTwoTone, SoundOutlined } from '@ant-design/icons';

import moment from 'moment';
import localization from 'moment/locale/de';

import { useUserActivities } from '../../client/trackers';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

/**
 * Generate the URL for an anchor by gthe give item/userActivity
 * 
 * @param {Object} item
 *  
 * @return {String} URL
 */
const getUrl = item => {
    const { refOpinion, refOpinionDetail, refActivity } = item.refs;
    let url = '/';

    switch (item.type) {
        case 'MENTIONED':
            if (refOpinion) {
                if (refOpinionDetail) {
                    url = `/opinions/${refOpinion}/${refOpinionDetail}`;
                } else {
                    url = `/opinions/${refOpinion}`;
                }
            }

            if (refActivity) {
                url += `#${refActivity}`;
            }
        
            break;

        default:
            url = '/';
    }

    return url;
}

export const UserActivitiesDrawer = ({ visible, onClose }) => {
    const [ userActivities, isLoading ] = useUserActivities({ orderBy:{ createdAt: -1} });

    const handleLinkClick = item => {
        return e => {
            if (item.unread) {
                Meteor.call('userActivity.setUnread', item._id, false, (err, res) => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                        });
                    }

                    if (onClose) {
                        setTimeout(onClose, 100);
                    }
                });
            } else {
                if (onClose) {
                    setTimeout(onClose, 100);
                }
            }            
        }
    }

    return (        
        <Drawer className="mbac-user-activies-drawer"
            title="Meine Aktivitäten"
            width={500}
            onClose={onClose || null}
            visible={visible}
            placement="left"
        >
            <List
                className="mbac-user-activities-list"
                header="Feed"
                itemLayout="horizontal"
                dataSource={userActivities}
                loading={isLoading}
                renderItem={item => (
                    <li className={["mbac-user-activity-item", item.unread ? "unread" : "read"].join(' ')}>
                        <a href={getUrl(item)} onClick={ handleLinkClick(item) }>
                            <Comment
                                extra={[
                                    !item.unread ? <EyeTwoTone /> : <EyeOutlined />
                                ]}
                                //author={ item.createdBy.firstName + ' ' + item.createdBy.lastName }
                                avatar={ <Avatar>{item.createdBy.firstName.charAt(0) + item.createdBy.lastName.charAt(0)}</Avatar> }
                                content={
                                    <div className="mbac-user-activity-content">
                                        <div className="message">
                                            <Space>
                                                <SoundOutlined size="large" />
                                                {item.message}
                                            </Space>
                                        </div>
                                        <div className="original-text" dangerouslySetInnerHTML={ {__html: item.originalContent} }  />
                                    </div>
                                }
                                datetime={
                                    <Tooltip title={moment(item.createdAt).format('DD.MM.YYYY HH:mm')}>
                                        <span>{moment(item.createdAt).locale('de', localization).fromNow()}</span>
                                    </Tooltip>
                                }
                            />
                        </a>
                    </li>
                )}
            />
        </Drawer>
    );
}