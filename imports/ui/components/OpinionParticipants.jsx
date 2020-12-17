import React, { Component, Fragment } from 'react'

import { List, Empty, Button } from 'antd';

import { 
    useOpinion
} from '../../client/trackers';

import {
    ExclamationCircleOutlined,
    DeleteOutlined, EditOutlined, PlusOutlined, DeleteTwoTone,
    LikeOutlined, LikeTwoTone,
    DislikeOutlined, DislikeTwoTone,
    MessageOutlined
} from '@ant-design/icons';

export const OpinionParticipants = ({refOpinion, participants}) => {
    return (
        <List
            //bordered
            //itemLayout="vertical"
            itemLayout="horizontal"
            dataSource={participants}
            locale={{
                emptyText: <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>keine Teilnehmer vorhanden</span>}
                >
                    <Button type="dashed">Jetzt Teilnehmer hinzufügen</Button>
                </Empty>
            }}
            renderItem={item => (
                <List.Item
                    actions={[
                        <DeleteOutlined key="1" onClick={ e => {} } />,
                        <EditOutlined key="2" onClick={ e => {} } />
                    ]}
                >
                    <List.Item.Meta
                        title={(item.gender + ' ' + item.firstName + (item.firstName && item.firstName.length ? ' ':'') + item.lastName)}
                        description={item.comment}
                    />
                </List.Item>
            )}
            footer={
                <div>
                    <Button block type="dashed" icon={<PlusOutlined />} >weiteren Teilnehmer hinzufügen</Button>
                </div>
            }
        />
    );
};
