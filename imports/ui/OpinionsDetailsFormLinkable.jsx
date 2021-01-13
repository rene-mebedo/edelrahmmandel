import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, {Fragment, useState, Component} from 'react';
import { 
    PageHeader, 
    Breadcrumb,
    Collapse,
    Layout,
    Button,
    Modal,
    Typography,
    Affix,
    Divider,
    Descriptions,
    Tag,
    Spin,
    Skeleton,
    Space
} from 'antd';

import {
    ExclamationCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;
const { Sider, Content } = Layout;
const { Text, Link } = Typography;


import { layouttypesObject } from '../api/constData/layouttypes';

import { ModalOpinionDetail } from './modals/OpinionDetail';
import { ModalFileUpload } from './modals/FileUpload';
import { OpinionBreadcrumb } from './components/OpinionBreadcrumb';
import { OpinionContent } from './OpinionContent';
import { OpinionDetailContent } from './OpinionDetailContent';

import { ListOpinionDetailsLinkable } from './ListOpinionDetailsLinkable';
import { hasPermission } from '../api/helpers/roles';

import { 
    useOpinion,
    useOpinionDetail
} from '../client/trackers';

import { ModalOpinion } from './modals/Opinion';
import { ActionTodoList } from './components/ActionTodoList';


export const DetailForm = ({refOpinion, refDetail, currentUser}) => {
    const [opinion, opinionIsLoading] = useOpinion(refOpinion);
    const [detail, detailIsLoading] = useOpinionDetail(refOpinion, refDetail);
    
    const [ canEdit, setCanEdit ] = useState(false);
    const [ canDelete, setCanDelete ] = useState(false);
    
    if (currentUser && !opinionIsLoading && opinion) {
        let edit = false,
            del = false,
            perm = { currentUser };

        const sharedWithUser = opinion.sharedWith.find( shared => shared.user.userId === currentUser._id );
        
        if (sharedWithUser && sharedWithUser.role) {
            perm.sharedRole = sharedWithUser.role;
        }
        
        edit = hasPermission(perm, 'opinion.edit');
        del = hasPermission(perm, 'opinion.remove');
        
        if (edit != canEdit) setCanEdit(edit);
        if (del != canDelete) setCanDelete(del);
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

    let pageHeaderButtons = [];

    if (detailIsLoading) {
        pageHeaderButtons = [
            <Space key="1">
                <Skeleton.Button key="1"/>
                <Skeleton.Button key="2"/>
                <Skeleton.Button key="3"/>
            </Space>
        ];
    } else if (detail) {
        if (canDelete) {
            pageHeaderButtons.push(
                <Button key="2"
                    onClick={ e => { removeDetail(detail._id) } }
                    icon={<DeleteOutlined />}
                >
                    Löschen
                </Button>
            );
        }
        if (canEdit && detail && layouttypesObject[detail.type].hasChilds) {
            pageHeaderButtons.push(
                <ModalFileUpload key="1"
                    mode="EDIT"
                    refOpinion={refOpinion}
                    refParentDetail={detail.refParentDetail}
                    refDetail={detail._id}
                />
            );
        }
        if (canEdit) {
            pageHeaderButtons.push(
                <ModalOpinionDetail key="0"
                    mode="EDIT"
                    refOpinion={refOpinion}
                    refDetail={detail._id}
                />
            );
        }
    } else {
        // no detail? and no refDetail, then we are at the top of the opinion
        if (refDetail === null) {
            if (canEdit) {
                pageHeaderButtons.push(
                    <ModalOpinion key="1"
                        mode="EDIT"
                        refOpinion={refOpinion}
                    />
                );
            }
        }
    }

    return (
        <Fragment>
            <Affix className="affix-opiniondetail" offsetTop={0}>
                <div style={{paddingTop:8}}>
                    <OpinionBreadcrumb
                        refOpinion={refOpinion}
                        refDetail={refDetail}
                    />

                    <PageHeader
                        className="site-page-header"
                        onBack={() => history.back()}
                        title={detailIsLoading || opinionIsLoading ? <Spin /> : ( (refDetail && detail) ? detail.title : opinion.title) }
                        extra={pageHeaderButtons}
                    />
                </div>
            </Affix>

            <Content>
                { refDetail === null
                    ? <OpinionContent refOpinion={refOpinion} currentUser={currentUser} canEdit={canEdit} canDelete={canDelete} /> // no content for a detail we need to display the Opinion-data itself
                    : <OpinionDetailContent refOpinion={refOpinion} refDetail={refDetail} />
                }

                { detail && detail.type === 'TODOLIST'
                    ? <ActionTodoList refOpinion={refOpinion} />
                    : (detail && layouttypesObject[detail.type].hasChilds) || refDetail === null
                        ? <Fragment>
                            <Divider orientation="left">Details</Divider>

                            <ListOpinionDetailsLinkable
                                refOpinion={refOpinion} 
                                refParentDetail={refDetail}
                                currentUser={currentUser}
                                canEdit={canEdit}
                                canDelete={canDelete}
                            />
                        </Fragment>
                        : null
                }

                {
                    canEdit && ((detail && layouttypesObject[detail.type].hasChilds) || refDetail === null)
                        ? <ModalOpinionDetail
                                mode="NEW" 
                                refOpinion={refOpinion} 
                                refParentDetail={refDetail}
                        />
                        : null
                }
            </Content>
        </Fragment>
    );
}



export const OpinionsDetailsFormLinkable = ({refOpinion, refDetail, currentUser}) => {
    return (
        <Layout>
            <Content>
                <DetailForm refOpinion={refOpinion} refDetail={refDetail} currentUser={currentUser}/>

                { /*!hasPermission({currentUser}, 'opinion.create') ? null :
                    <ModalOpinionDetail
                        mode="NEW" 
                        refOpinion={refOpinion} 
                        refParentDetail={refDetail}
                    />*/
                }
            </Content>
        </Layout>
    );
}