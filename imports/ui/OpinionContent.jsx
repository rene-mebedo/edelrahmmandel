import React, { Fragment } from 'react'

import Descriptions from 'antd/lib/descriptions';
import Skeleton from 'antd/lib/skeleton';
import Tag from 'antd/lib/tag';
import Avatar from 'antd/lib/avatar';
//import Typography from 'antd/lib/typography';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import { useOpinion } from '../client/trackers';

import moment from 'moment';

import { OpinionParticipants } from './components/OpinionParticipants';
import { ModalOpinion } from './modals/Opinion';

//const { Text } = Typography;

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
            </Descriptions>
        </Fragment>
    )
}