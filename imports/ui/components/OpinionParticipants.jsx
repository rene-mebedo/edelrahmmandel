import React from 'react'

import List from 'antd/lib/list';
import Empty from 'antd/lib/empty';
//import Button from 'antd/lib/button';

import { ModalOpinionParticipant } from '../modals/OpinionParticipant';

//import { useOpinion } from '../../client/trackers';


/*import ExclamationCircleOutlined from '@ant-design/icons/';
import DeleteOutlined from '@ant-design/icons/';
import EditOutlined from '@ant-design/icons/';
import PlusOutlined from '@ant-design/icons/';
import DeleteTwoTone from '@ant-design/icons/';
import LikeOutlined from '@ant-design/icons/';
import LikeTwoTone from '@ant-design/icons/';
import DislikeOutlined from '@ant-design/icons/';
import DislikeTwoTone from '@ant-design/icons/';
import MessageOutlined from '@ant-design/icons/';*/


export const OpinionParticipants = ({refOpinion, participants, currentUser, canEdit=false, canDelete=false}) => {
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
                p => <ModalOpinionParticipant refOpinion={refOpinion} mode="EDIT" participant={p} canEdit={canEdit} />
            }
            
            footer={
                !canEdit ? null : <ModalOpinionParticipant refOpinion={refOpinion} mode="NEW" />
            }
        />
    );
};
