import React, { Component, Fragment } from 'react'

import { List, Empty, Button } from 'antd';

import { ModalOpinionParticipant } from '../modals/OpinionParticipant';

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
                    {//<Button type="dashed">Jetzt Teilnehmer hinzufügen</Button>
                    }
                </Empty>
            }}
            renderItem={
                p => <ModalOpinionParticipant refOpinion={refOpinion} mode="EDIT" participant={p} />
            }
           
            footer={
                <ModalOpinionParticipant refOpinion={refOpinion} mode="NEW" />
            }
        />
    );
};
