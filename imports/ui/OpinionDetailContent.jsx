import React, { Component, Fragment } from 'react'

import { Descriptions, Skeleton, Tag } from 'antd';

import { useOpinionDetail } from '../client/trackers';
import { Heading } from './ListOpinionDetails/detailtypes/Heading';
import { Text } from './ListOpinionDetails/detailtypes/Text';
import { Answer } from './ListOpinionDetails/detailtypes/Answer';
import { Bestimmungen } from './ListOpinionDetails/detailtypes/Bestimmungen';
import { Pagebreak } from './ListOpinionDetails/detailtypes/Pagebreak';
import { ClassifiedOutput } from './ListOpinionDetails/detailtypes/ClassifiedOutput';
import { Question } from './ListOpinionDetails/detailtypes/Question';


export const OpinionDetailContent = ({refOpinion, refDetail, permissions}) => {
    const [detail, detailIsLoading] = useOpinionDetail(refOpinion, refDetail);

    if (detailIsLoading) {
        return (
            <Skeleton paragraph={{ rows: 4 }} />
        );
    }
    

    if (!detail) return null;

    /*return (
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

            { !(detail.type === 'ANSWER' || detail.type === 'QUESTION') 
                ? null
                : <Fragment>
                    <Descriptions.Item label="Maßnahme">
                        <ActionCodeDropdown
                            key="3"
                            refDetail={detail._id}
                            value={detail.actionCode}
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="Maßnahme (Text)">
                        <div dangerouslySetInnerHTML={ {__html: (detail.actionText ? detail.actionText : '').replace(/\n/g,'<br/>')} } />
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
    )*/

    const props = {
        key: detail._id,
        item: detail, 
        permissions,
        first: true,
        last: false
    }
    if (detail.type == 'HEADING') return <Heading {...props} />;
    if (detail.type == 'TEXT') return <Text {...props} />;
    if (detail.type == 'QUESTION') return <Question {...props} />;
    if (detail.type == 'ANSWER') return <Answer {...props} />;
    if (detail.type == 'BESTIMMUNGEN') return <Bestimmungen {...props} />;
    if (detail.type == 'PAGEBREAK') return <Pagebreak {...props} />;
    
    return <ClassifiedOutput {...props} />;
}