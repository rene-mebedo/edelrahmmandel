import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, {Fragment, useState} from 'react';
import { Button, Row, Col, Collapse, Modal } from 'antd';

import {
    ExclamationCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import { ModalOpinionDetailNew } from './modals/OpinionDetailNew';
import { ModalOpinionDetailEdit } from './modals/OpinionDetailEdit';

import { OpinionDetails } from '/imports/api/collections/opinionDetails';

import { layouttypesObject } from '/imports/api/constData/layouttypes';

const { Panel } = Collapse;

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
            opinionDetails = OpinionDetails.find({ refParentDetail }).fetch();
        } else {
            opinionDetails = OpinionDetails.find({ refOpinion, refParentDetail: null }).fetch();
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

    const renderTypedetails = type => {
        if (type == 'INFO') {
            return (
                <div>
                    <strong>I N F O:</strong>
                </div>
            )
        }
    }

    const renderOpinionDetails = () => {
        return opinionDetails.map( detail => {
            return (
                <Panel header={detail.title} key={detail._id}>
                    <Row>
                        <Col flex="1 1">
                            { renderTypedetails(detail.type) }
                            <div dangerouslySetInnerHTML={ {__html: detail.text}} />
                        </Col>
                        <Col flex="60px" style={{minHeight:'80px'}}>
                            <ModalOpinionDetailEdit opinionDetailId={detail._id} />

                            <Button 
                                onClick={ e => {removeDetail(detail._id)} }
                                danger type="dashed" shape="round" icon={<DeleteOutlined />} 
                            />
                        </Col>
                    </Row>
                    
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

    const handleChange = () => {

    }

    return (
        <Fragment>
            <Collapse onChange={handleChange}>
                { renderOpinionDetails() }
            </Collapse>
        </Fragment>
    );
}