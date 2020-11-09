import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, {Fragment, useState} from 'react';
import { Button, Row, Col, Collapse, Modal } from 'antd';

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

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


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
        return opinionDetails.map( (detail, index) => {
            return (
                <Draggable key={detail._id} draggableId={detail._id} index={index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            /*style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                            )}*/
                        >
                            <Panel header={detail.title} key={detail._id} className={currentDetailId == detail._id ? "active-detail-panel":""}>
                                <Row>
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
                        </div>
                    )}
                </Draggable>
            )
        });
    }

    const handleChangeCollapse = (detailId) => {
        let lastDetailId = FlowRouter.getQueryParam("lastdetail");
 
        if (!lastDetailId) lastDetailId = detailId;
        if (!detailId) detailId = lastDetailId;
 
        FlowRouter.setQueryParams({detail: detailId, lastdetail: lastDetailId});
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
    };

    const onDragEnd = result => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            opinionDetails,
            result.source.index,
            result.destination.index
        );
    }


    return (
        <Fragment>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            //style={getListStyle(snapshot.isDraggingOver)}
                        >
                            <Collapse accordion onChange={handleChangeCollapse}>
                                { renderOpinionDetails() }
                            </Collapse>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Fragment>
    );
}