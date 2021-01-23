import React, { Fragment, useState } from 'react'

import Descriptions from 'antd/lib/descriptions';
import Skeleton from 'antd/lib/skeleton';
import Tag from 'antd/lib/tag';
import Avatar from 'antd/lib/avatar';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Space from 'antd/lib/space';

import FilePdfOutlined from '@ant-design/icons/FilePdfOutlined';

import { useOpinion, useOpinionPdfs } from '../client/trackers';

import { OpinionParticipants } from './components/OpinionParticipants';
import { ModalOpinion } from './modals/Opinion';

import filesize from 'filesize';
import moment from 'moment';


const Expert = ({user}) => {
    if (!user) return null;

    const { userId, firstName, lastName, company, position, qualification, advancedQualification } = user;

    return (
        <div className="user-avatar-data">
            <Row>
                <Col flex="40px">
                    <Avatar style={{ /*backgroundColor: 'orange',*/ verticalAlign: 'middle' }} /*size="large" gap={16}*/>
                        { firstName && firstName.length > 0
                            ? firstName.substring(0,1) + lastName.substring(0,1)
                            : lastName.substring(0,2)
                        }
                    </Avatar>
                </Col>
                <Col flex="auto">
                    <div className="user-name" style={{marginTop: 6}}>{firstName} {lastName}</div>
                </Col>
            </Row>
            <Row>
                <Col flex="40px">
                    
                </Col>
                <Col flex="auto">
                    <div className="user-data">
                        { position 
                            ? <div className="position" style={{color:'#999'}}>{position}</div>
                            : null
                        }
                        { company
                            ? <div className="company" style={{color:'#666', fontWeight: 600}}>{company}</div>
                            : null
                        }
                        { qualification 
                            ? <div className="qualification" style={{color:'#999'}}>{qualification}</div>
                            : null
                        }
                        { advancedQualification 
                            ? <div className="advanced-qualification" style={{color:'#999'}}>{advancedQualification}</div>
                            : null
                        }
                    </div>
                </Col>
            </Row>

            
        </div>
    );
}

export const OpinionContent = ({refOpinion, currentUser, canEdit=false, canDelete=false}) => {
    const [ opinion, isLoading ] = useOpinion(refOpinion);
    const [ pdfs, isPdfLoading ] = useOpinionPdfs(refOpinion);
    const [ pendingPdfCreation, setPendingPdfCreation] = useState(false);

    const createPDF = () => {
        setPendingPdfCreation(true);
        Meteor.call('opinion.createPDF', refOpinion, (err, fileRef) => {
            console.log(fileRef);
            setPendingPdfCreation(false);
        });
    }
    
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
                <Descriptions.Item label="Titel">{opinion.title} Nr. {opinion.opinionNo}</Descriptions.Item>
                <Descriptions.Item label="Beschreibung">{opinion.description}</Descriptions.Item>
                
                <Descriptions.Item label="Kunde" span={2}>
                    <div>{opinion.customer.name}</div>
                    <div>{opinion.customer.street}</div>
                    <div>{opinion.customer.postalCode + ' ' + opinion.customer.city}</div>
                </Descriptions.Item>
                
                <Descriptions.Item label="Datum von">{moment(opinion.dateFrom).format('DD. MMMM YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Datum bis">{moment(opinion.dateTill).format('DD. MMMM YYYY')}</Descriptions.Item>

                <Descriptions.Item label="Teilnehmer" span={2}>
                    <OpinionParticipants 
                        refOpinion={refOpinion} 
                        participants={opinion.participants} 
                        currentUser={currentUser} 
                        canEdit={canEdit} 
                        canDelete={canDelete} 
                    />
                </Descriptions.Item>

                
                <Descriptions.Item label="Gutachter 1">
                    { opinion.expert1 
                        ? <Expert user={opinion.expert1} />
                        : <ModalOpinion 
                                mode='EDIT' refOpinion={refOpinion} 
                                buttonCaption="Jetzt Gutachter festlegen" 
                                buttonType="dashed"
                                defaultTab="Erweitert"
                        />
                    }
                </Descriptions.Item>

                <Descriptions.Item label="Gutachter 2">
                    <Expert user={opinion.expert2} />
                </Descriptions.Item>

                <Descriptions.Item label="PDF-Dokumente">
                    <Table
                        //bordered
                        size="small"
                        loading={isPdfLoading}
                        pagination={false}
                        dataSource={pdfs}
                        rowKey="_id"
                        showHeader={false}
                        columns={[
                            {
                                title: 'Titel',
                                dataIndex: 'title',
                                key: 'title',
                                render: (text, item) => <a href={item.link} target="_blank">
                                    <Space><FilePdfOutlined /><span>Gutachtliche Stellungnahme</span></Space>
                                </a>
                            }, {
                                title: 'Erstellt am',
                                dataIndex: 'meta.createdAt',
                                key: 'createdAt',
                                render: (text, item) => moment(item.meta.createdAt).format('DD.MM.YYYY HH:mm:ss')
                            }, {
                                title: 'Erstellt von',
                                dataIndex: 'meta.createdBy',
                                key: 'createdBy',
                                render: (text, item) => {
                                    if (!item.meta.createdBy) return 'Unbekannt';
                                    
                                    const { firstName, lastName } = item.meta.createdBy;
                                    
                                    return `${firstName} ${lastName}`
                                }
                            }, {
                                title: 'Größe',
                                dataIndex: 'size',
                                key: 'size',
                                align:"right",
                                render: size => filesize(size)
                            }, {
                                title: 'Status',
                                dataIndex: '_id',
                                key: '_id',
                                align:"center",
                                render: (_id, item, index) => <Space>
                                    <Tag color={index==0?"green":"orange"}>{index == 0 ? 'Aktuell':'Entwurf'}</Tag>
                                    <Tag color="blue">v{pdfs.length - index}</Tag>
                                </Space>
                            }
                        ]}
                    />

                    <Button block onClick={createPDF} loading={pendingPdfCreation} style={{marginTop:16}}>
                        <FilePdfOutlined /> PDF erstellen
                    </Button>
                </Descriptions.Item>
            </Descriptions>
        </Fragment>
    )
}