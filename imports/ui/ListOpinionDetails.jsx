import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, {Fragment, useState} from 'react';
import { Button, Row, Col, Collapse, Modal, Space, Typography } from 'antd';

import { FlowRouter } from 'meteor/kadira:flow-router';

import {
    ExclamationCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import { ModalOpinionDetailNew } from './modals/OpinionDetailNew';
import { ModalOpinionDetailEdit } from './modals/OpinionDetailEdit';

import { OpinionDetails } from '/imports/api/collections/opinionDetails';

import { layouttypesObject } from '/imports/api/constData/layouttypes';

const { Panel } = Collapse;

const { Text, Link } = Typography;

export const ListOpinionDetails = ({ refOpinion, refParentDetail }) => {
    const [ showModalEdit, setShowModalEdit ] = useState(false);

    const { opinionDetails, isLoading } = useTracker(() => {
        const noDataAvailable = { opinionDetails: [] };

        if (!Meteor.user()) {
            return noDataAvailable;
        }
        const handler = Meteor.subscribe('opinionDetails', {refOpinion, refParentDetail});
    
        if (!handler.ready()) { 
            return { ...noDataAvailable, isLoading: true };
        }
    
        let opinionDetails;
        if (refParentDetail) {
            opinionDetails = OpinionDetails.find({ refParentDetail }, { sort: {orderString: 1}}).fetch();
        } else {
            opinionDetails = OpinionDetails.find({ refOpinion, refParentDetail: null }, { sort: {orderString: 1}}).fetch();
        }

        return { opinionDetails, isLoading: false };
    });

    const toggleShowOpinionDetail = e => {
        setShowModalEdit(!showModalEdit)
    }

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

    const renderTypedetails = detail => {
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
    }

    const renderOpinionDetails = () => {
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
                        <Fragment>
                            <Space>
                                <Text mark>{detail.orderString}</Text>
                                <Text>{detail.title}</Text>
                            </Space>
                        </Fragment>
                    }
                    key={detail._id} 
                    extra={detail.deleted ? null :
                        <Fragment>
                            <ModalOpinionDetailEdit opinionDetailId={detail._id} />
                            <Space />
                            <DeleteOutlined onClick={ e => {e.stopPropagation();removeDetail(detail._id)}} />
                            {/*<Button 
                                onClick={ e => {e.stopPropagation(); removeDetail(detail._id)} }
                                danger ghost type="text" size="small" icon={<DeleteOutlined />} 
                            />*/}
                        </Fragment>
                    }
                >
                    { renderTypedetails(detail) }
                    { /*<Row>
                        <Col flex="1 1">
                            { renderTypedetails(detail) }
                        </Col>
                        <Col flex="60px" style={{minHeight:'80px'}}>
                            <ModalOpinionDetailEdit opinionDetailId={detail._id} />

                            <Button 
                                onClick={ e => {removeDetail(detail._id)} }
                                danger type="dashed" shape="round" icon={<DeleteOutlined />} 
                            />
                        </Col>
                    </Row>*/}
                    
                    <ListOpinionDetails 
                        refOpinion={refOpinion}
                        refParentDetail={detail._id}
                    />

                    { !layouttypesObject[detail.type].hasChilds ? null : 
                        <ModalOpinionDetailNew 
                            refOpinion={refOpinion} 
                            refParentDetail={detail._id}
                        />
                    }
                </Panel>
            )
        });
    }

    const handleChangeCollapse = (detailId) => {
        let lastDetailId = FlowRouter.getQueryParam("lastdetail");
 
        if (!lastDetailId) lastDetailId = detailId;
        if (!detailId) detailId = lastDetailId;
 
        FlowRouter.setQueryParams({detail: detailId, lastdetail: lastDetailId});
    }

    return (
        <Fragment>
            <Collapse accordion onChange={handleChangeCollapse}>
                { renderOpinionDetails() }
            </Collapse>
        </Fragment>
    );
}