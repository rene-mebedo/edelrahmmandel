import { Meteor } from 'meteor/meteor';

import React, {Fragment, useState} from 'react';
import { Tooltip, Collapse, Modal, Space, Typography, List, Tag, Skeleton, } from 'antd';

import {
    ExclamationCircleOutlined,
    DeleteOutlined, DeleteTwoTone,
    LikeOutlined, LikeTwoTone,
    DislikeOutlined, DislikeTwoTone,
    MessageOutlined
} from '@ant-design/icons';

//import { ModalOpinionDetail } from './modals/OpinionDetail';
import { ActionCodeDropdown } from './components/ActionCodeDropdown';
import { ActionCodeTag } from './components/ActionCodeTag';

const { Link } = Typography;


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

    const toggleDeleted = id => {
        Meteor.call('opinionDetail.toggleDeleted', id, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
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

    const doSocial = (action, id) => {
        Meteor.call('opinionDetail.doSocial', action, id, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            }
        });
    }

    const doneBefore = arr => {
        const uid = Meteor.userId();
        
        return arr.filter( ({userId}) => userId == uid ).length > 0;
    }

    const listSocial = list => {
        return (
            <div className="mbac-tooltip-social-list">
                <ul className="ant-list">
                    {
                        list.map( ({userId, firstName, lastName}) => <li className="ant-list-item" key={userId}>{firstName + (firstName ? ' ':'') + lastName}</li>)
                    }
                </ul>   
            </div> 
        );
    }

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
                            <div key="like">
                                <Tooltip className="mbac-simple-social-list" title={listSocial(item.likes)}>
                                    <Space>
                                        { doneBefore(item.likes)
                                            ?<LikeTwoTone onClick={ e => {doSocial('like', item._id)} } />
                                            :<LikeOutlined onClick={ e => {doSocial('like', item._id)} } />
                                        }
                                        <span>{item.likes.length}</span>
                                    </Space>
                                </Tooltip>
                            </div>,
                            <div key="dislike">
                                <Tooltip className="mbac-simple-social-list" title={listSocial(item.dislikes)}>
                                    <Space>
                                        { doneBefore(item.dislikes)
                                            ?<DislikeTwoTone onClick={ e => {doSocial('dislike', item._id)} } />
                                            :<DislikeOutlined onClick={ e => {doSocial('dislike', item._id)} } />
                                        }
                                        <span>{item.dislikes.length}</span>
                                    </Space>
                                </Tooltip>
                            </div>,

                            <IconText icon={MessageOutlined} text={item.commentsCount + item.activitiesCount} key="list-vertical-message" />,

                            <div key="deleted">
                                { !item.deleted
                                    ?<DeleteOutlined key="1" onClick={ e => {e.stopPropagation(); toggleDeleted(item._id)}} />
                                    :<DeleteTwoTone key="1" onClick={ e => {e.stopPropagation(); toggleDeleted(item._id)}} />
                                }
                            </div>
                        ]}
                        extra={
                            item.type == 'QUESTION' /*|| item.type == 'ANSWER'*/ ? 
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
                                <Tooltip title={item.title}>
                                    <Link href={`/opinions/${item.refOpinion}/${item._id}`}>
                                        <Space>
                                            <Tag color="blue">{item.orderString}</Tag>
                                            <span>{item.title}</span>
                                            { item.type !== 'ANSWER' ? null :
                                                <ActionCodeTag actionCode={item.actionCode} />
                                            }
                                        </Space>
                                    </Link>                                
                                </Tooltip>
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