import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, {Fragment, useState} from 'react';
import { Button, Row, Col, Collapse, Modal, Space, Typography, List, Tag, Skeleton, } from 'antd';

import {
    ExclamationCircleOutlined,
    DeleteOutlined,
    LikeOutlined,
    StarOutlined,
    MessageOutlined
} from '@ant-design/icons';

//import { ModalOpinionDetail } from './modals/OpinionDetail';
import { ActionCodeDropdown } from './components/ActionCodeDropdown';

import { OpinionDetails } from '/imports/api/collections/opinionDetails';

import { layouttypesObject } from '/imports/api/constData/layouttypes';

const { Panel } = Collapse;

const { Text, Link, Paragraph } = Typography;


const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);


import HTMLEllipsis from 'react-lines-ellipsis/lib/html'
import { 
    useOpinionSubscription,
    useOpinionDetails
} from '../client/trackers';


export const ListOpinionDetailsLinkable = ({ refOpinion, refParentDetail }) => {
    const [ showModalEdit, setShowModalEdit ] = useState(false);

    const opinionIsLoading = useOpinionSubscription(refOpinion);
    const [ opinionDetails, isLoading ] = useOpinionDetails(refOpinion, refParentDetail);

    const removeDetail = id => {
        Modal.confirm({
            title: 'Löschen',
            icon: <ExclamationCircleOutlined />,
            content: 'Soll der Eintrag wirklich gelöscht werden?',
            okText: 'OK',
            cancelText: 'Abbruch',
            onOk: closeConfirm => {
                closeConfirm();

                Meteor.call('opinionDetail.remove', id, (err, res) => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                        });
                    }
                });
            }
        });
    }

    /*const renderTypedetails = detail => {
        if (detail.type == 'INFO') {
            return (
                <div>
                    <strong>I N F O:</strong>
                    <div dangerouslySetInnerHTML={ {__html: detail.text}} />
                </div>
            )
        }

        return (
            <div dangerouslySetInnerHTML={ {__html: detail.text}} />
        );
    }*/

    /*const renderOpinionDetails = () => {
        const currentDetailId = FlowRouter.getQueryParam("detail");
        return opinionDetails.map( detail => {
            let cN = currentDetailId == detail._id ? ['active-detail-panel']: [];
            if (detail.deleted) {
                cN.push('detail-deleted');
            }
            
            return (
                <Panel
                    className={cN.join(' ')}
                    header={ 
                        <Link href={"/opinions/" + refOpinion + '/' + detail._id}>
                            <Space>
                                <Text mark>{detail.orderString}</Text>
                                <Text>{detail.title}</Text>
                            </Space>
                        </Link>
                    }
                    key={detail._id} 
                    extra={detail.deleted ? null :
                        <Fragment>
                            <ModalOpinionDetail
                                mode="EDIT"
                                refDetail={detail._id}
                            />
                            <Space />
                            <DeleteOutlined onClick={ e => {e.stopPropagation();removeDetail(detail._id)}} />
                        </Fragment>
                    }
                >
                    { renderTypedetails(detail) }
                    
                    <ListOpinionDetailsLinkable
                        refOpinion={refOpinion}
                        refParentDetail={detail._id}
                    />

                    { !layouttypesObject[detail.type].hasChilds ? null : 
                        <ModalOpinionDetail mode="NEW"
                            refOpinion={refOpinion} 
                            refParentDetail={detail._id}
                        />
                    }
                </Panel>
            )
        });
    }*/

    /*const handleChangeCollapse = (detailId) => {
        let lastDetailId = FlowRouter.getQueryParam("lastdetail");
 
        if (!lastDetailId) lastDetailId = detailId;
        if (!detailId) detailId = lastDetailId;
 
        FlowRouter.setQueryParams({detail: detailId, lastdetail: lastDetailId});
    }*/

    return (
        <Fragment>
            <List
                className="opinion-details-list"
                itemLayout="vertical"
                loading={isLoading}
                dataSource={opinionDetails}
                renderItem={item => (
                    <List.Item
                        className={item.deleted ? "item-deleted" : null }
                        key={item._id}
                        actions={[
                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            <DeleteOutlined key="1" onClick={ e => {e.stopPropagation();removeDetail(item._id)}} />
                        ]}
                        extra={
                            item.type == 'QUESTION' || item.type == 'ANSWER' ? 
                                <ActionCodeDropdown
                                    refDetail={item._id}
                                    actionCode={item.actionCode}
                                />
                            : null
                        }
                    >
                        <List.Item.Meta
                            //avatar={<Avatar src={item.avatar} />}
                            title={
                                <Link href={`/opinions/${item.refOpinion}/${item._id}`}>
                                    <Tag color="blue">{item.orderString}</Tag> {item.title}
                                </Link>
                            }
                            description={
                                <HTMLEllipsis
                                    unsafeHTML={item.text}
                                    maxLine='2'
                                    ellipsis='...'
                                    basedOn='letters'
                                />
                            }
                        />
                        {
                            //Irgendeintext als zusätzlicher Content und noch mehr....
                        }
                    </List.Item>
                )}
            />

            <Skeleton loading={isLoading} paragraph={{rows:14}} />
        </Fragment>
    );
}