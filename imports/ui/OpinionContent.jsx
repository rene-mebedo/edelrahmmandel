import React, { Component, Fragment } from 'react'

import { Descriptions, Skeleton, Tag } from 'antd';

import { 
    useOpinion
} from '../client/trackers';

import moment from 'moment';

import { OpinionParticipants } from './components/OpinionParticipants';

export const OpinionContent = ({refOpinion}) => {
    const [opinion, isLoading] = useOpinion(refOpinion);

    if (isLoading) {
        return (
            <Skeleton paragraph={{ rows: 4 }} />
        );
    }

    return (
        <Fragment>
            { !opinion.isTemplate ? null :
                <p><Tag size="large" color="green">Vorlage</Tag></p>
            }

            <Descriptions 
                layout="vertical"
                size="small"
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            >
                <Descriptions.Item label="Titel">{opinion.title}</Descriptions.Item>
                <Descriptions.Item label="Beschreibung">{opinion.description}</Descriptions.Item>
                
                <Descriptions.Item label="Kunde" span={2}>
                    <div>{opinion.customer.name}</div>
                    <div>{opinion.customer.street}</div>
                    <div>{opinion.customer.postalCode + ' ' + opinion.customer.city}</div>
                </Descriptions.Item>
                
                <Descriptions.Item label="Datum von">{moment(opinion.dateFrom).format('DD. MMMM YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Datum bis">{moment(opinion.dateTill).format('DD. MMMM YYYY')}</Descriptions.Item>

                <Descriptions.Item label="Teilnehmer" span={2}>
                    <OpinionParticipants refOpinion={refOpinion} participants={opinion.participants} />
                </Descriptions.Item>

                <Descriptions.Item label="Gutachter 1">{opinion.expert1}</Descriptions.Item>
                <Descriptions.Item label="Gutachter 2">{opinion.expert2}</Descriptions.Item>
            </Descriptions>
        </Fragment>
    )
}