import React, { Component, Fragment } from 'react'

import { Descriptions, Skeleton, Tag } from 'antd';

import { ActionCodeDropdown } from './components/ActionCodeDropdown';

import { layouttypesObject } from '/imports/api/constData/layouttypes';
import { 
    useOpinionDetail
} from '../client/trackers';


export const OpinionDetailContent = ({refOpinion, refDetail}) => {
    const [detail, detailIsLoading] = useOpinionDetail(refOpinion, refDetail);

    if (detailIsLoading) {
        return (
            <Skeleton paragraph={{ rows: 4 }} />
        );
    }

    return (
        <Descriptions 
            layout="vertical"
            size="small"
            bordered
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
            <Descriptions.Item label="Sortierung">
                <Tag color="blue">{detail.orderString}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Typ">{layouttypesObject[detail.type || 'UNKNOWN'].title}</Descriptions.Item>

            { !(detail.type === 'ANSWER' || detail.type === 'QUESTION') ? null
                :<Fragment>
                    <Descriptions.Item label="Maßnahme">
                        <ActionCodeDropdown
                            key="3"
                            refDetail={detail._id}
                            actionCode={detail.actionCode}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Maßnahme (Text)">
                        Irgend ein langer Text der unter Punkt 8 eingetragen wir als Maßnahme.
                        Zu bewerten ist die Relevanz und die Einschätzung des Kunden.
                        {detail.stepText}
                    </Descriptions.Item>
                </Fragment>
            }

            <Descriptions.Item label="Titel" span={2}>{detail.title}</Descriptions.Item>

            { !detail.text ? null :
                <Descriptions.Item label="Text" span={2}>
                    <div dangerouslySetInnerHTML={ {__html: detail.text}} />
                </Descriptions.Item>
            }
        </Descriptions>
    )
}