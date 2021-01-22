import React, { Fragment, useState } from 'react';

import PageHeader from 'antd/lib/page-header';
import Layout from 'antd/lib/layout';
import Affix from 'antd/lib/affix';
import Space from 'antd/lib/space';
import Skeleton from 'antd/lib/skeleton';
import Spin from 'antd/lib/spin';
import Button from 'antd/lib/button';

const { Content } = Layout;

import { layouttypesObject } from '../api/constData/layouttypes';

import { ModalFileUpload } from './modals/FileUpload';
import { ModalOpinion } from './modals/Opinion';
import { ActionTodoList } from './components/ActionTodoList';
import { OpinionBreadcrumb } from './components/OpinionBreadcrumb';
import { OpinionContent } from './OpinionContent';

import { ListOpinionDetails } from './ListOpinionDetails/ListOpinionDetails';
import { hasPermission } from '../api/helpers/roles';

import { 
    useOpinion,
    useOpinionDetail
} from '../client/trackers';


/*
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

    let pageHeaderButtons = [];

    if (detailIsLoading) {
        pageHeaderButtons = [
            <Space key="1">
                <Skeleton.Button key="1"/>
                <Skeleton.Button key="2"/>
                <Skeleton.Button key="3"/>
            </Space>
        ];
    } else {
        // no detail? and no refDetail, then we are at the top of the opinion
        if (!detail && refDetail === null) {
            if (canEdit) {
                pageHeaderButtons.push(
                    <ModalOpinion key="1"
                        mode="EDIT"
                        refOpinion={refOpinion}
                    />
                );
            }
        } else {
            // place possibility to upload pictures
            // if the detail could have children
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
        }
    }

    const getPageHeaderTitle = () => {
        if (refDetail && detail) {
            if (detail.type == 'HEADING') return detail.printTitle;
            if (detail.type == 'TEXT') return detail.text;
            if (detail.type == 'QUESTION') return detail.printTitle;
            if (detail.type == 'ANSWER') return detail.title;
            if (detail.type == 'BESTIMMUNGEN') return detail.printTitle;
            if (detail.type == 'PAGEBREAK') return detail.title;
            
            return detail.printTitle;
        }
        
        return opinion.title;
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
                        title={detailIsLoading || opinionIsLoading ? <Spin /> : getPageHeaderTitle() }
                        extra={pageHeaderButtons}
                    />
                </div>
            </Affix>

            <Content>
                { refDetail === null
                    ? <OpinionContent refOpinion={refOpinion} currentUser={currentUser} canEdit={canEdit} canDelete={canDelete} />
                    : null 
                }

                { detail && detail.type === 'TODOLIST'
                    ? <ActionTodoList refOpinion={refOpinion} />
                    : (detail && layouttypesObject[detail.type].hasChilds) || refDetail === null
                        ? <ListOpinionDetails
                                refOpinion={refOpinion} 
                                refParentDetail={refDetail}
                                currentUser={currentUser}
                                canEdit={canEdit}
                                canDelete={canDelete}
                          />
                        : null
                }
            </Content>
        </Fragment>
    );
}

export const OpinionsDetailsForm = ({refOpinion, refDetail, currentUser}) => {
    
    return (
        <Layout>
            <Content>
                <DetailForm refOpinion={refOpinion} refDetail={refDetail} currentUser={currentUser}/>
            </Content>
        </Layout>
    );
}
*/


export const OpinionsDetailsForm = ({refOpinion, refDetail, currentUser}) => {
    const [opinion, opinionIsLoading] = useOpinion(refOpinion);
    const [detail, detailIsLoading] = useOpinionDetail(refOpinion, refDetail);
    
    const [ canEdit, setCanEdit ] = useState(false);
    const [ canDelete, setCanDelete ] = useState(false);
    
    /*const createPDF = () => {
        Meteor.call('opinion.createPDF', refOpinion, (err, res) => {
            console.log(err, res);
        });
    }*/

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

    let pageHeaderButtons = [];

    if (detailIsLoading) {
        pageHeaderButtons = [
            <Space key="1">
                <Skeleton.Button key="1"/>
                <Skeleton.Button key="2"/>
                <Skeleton.Button key="3"/>
            </Space>
        ];
    } else {
        // no detail? and no refDetail, then we are at the top of the opinion
        if (!detail && refDetail === null) {
            if (canEdit) {
                pageHeaderButtons.push(
                    <ModalOpinion key="1"
                        mode="EDIT"
                        refOpinion={refOpinion}
                    />
                );

                /*pageHeaderButtons.push(
                    <Button key="2"
                        onClick={createPDF}
                    >PDF erstellen</Button>
                );*/
            }
        } else {
            // place possibility to upload pictures
            // if the detail could have children
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
        }
    }

    const getPageHeaderTitle = () => {
        if (refDetail && detail) {
            if (detail.type == 'HEADING') return detail.printTitle;
            if (detail.type == 'TEXT') return detail.text;
            if (detail.type == 'QUESTION') return detail.printTitle;
            if (detail.type == 'ANSWER') return detail.title;
            if (detail.type == 'BESTIMMUNGEN') return detail.printTitle;
            if (detail.type == 'PAGEBREAK') return detail.title;
            
            return detail.printTitle;
        }
        
        return opinion.title;
    }
    
    return (
        <Layout>
            <Content>
                <Affix className="affix-opiniondetail" offsetTop={0}>
                    <div style={{paddingTop:8}}>
                        <OpinionBreadcrumb
                            refOpinion={refOpinion}
                            refDetail={refDetail}
                        />

                        <PageHeader
                            className="site-page-header"
                            onBack={() => history.back()}
                            title={detailIsLoading || opinionIsLoading ? <Spin /> : getPageHeaderTitle() }
                            extra={pageHeaderButtons}
                        />
                    </div>
                </Affix>

                <Content>
                    { refDetail === null
                        ? <OpinionContent refOpinion={refOpinion} currentUser={currentUser} canEdit={canEdit} canDelete={canDelete} />
                        : null 
                    }

                    { detail && detail.type === 'TODOLIST'
                        ? <ActionTodoList refOpinion={refOpinion} />
                        : (detail && layouttypesObject[detail.type].hasChilds) || refDetail === null
                            ? <ListOpinionDetails
                                    refOpinion={refOpinion} 
                                    refParentDetail={refDetail}
                                    currentUser={currentUser}
                                    canEdit={canEdit}
                                    canDelete={canDelete}
                            />
                            : null
                    }
                </Content>
            </Content>
        </Layout>
    );
}
