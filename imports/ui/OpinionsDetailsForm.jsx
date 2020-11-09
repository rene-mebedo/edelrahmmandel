import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    PageHeader, 
    Breadcrumb,
    Collapse,
    Layout,
} from 'antd';

const { Panel } = Collapse;
const { Sider, Content } = Layout;


import { ModalOpinionDetailNew } from './modals/OpinionDetailNew';
import { ListOpinionDetails } from './ListOpinionDetails';


export const OpinionsDetailsForm = ({refOpinion}) => {
    const collapseGeneralChanged = () => {

    }

    return (
        <Fragment>
            <Layout>
                <Content>
                    <Breadcrumb>
                        <Breadcrumb.Item>Start</Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a href="">Gutachten</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a href="">ENGIE Köln - Nr. 6473647</a>
                        </Breadcrumb.Item>
                    </Breadcrumb>

                    <PageHeader
                        className="site-page-header"
                        title="ENGIE Köln - Nr. 6473647"
                        subTitle="Details zum Gutachten."
                    />

                    <Collapse onChange={collapseGeneralChanged}>
                        <Panel header="0. Allgemein" key="1">
                            <Collapse defaultActiveKey="1">
                                <Panel header="This is panel nest panel" key="1">
                                    <p>Foo Bar Baz</p>
                                </Panel>
                            </Collapse>
                        </Panel>

                    </Collapse>

                    <ListOpinionDetails 
                        refOpinion={refOpinion} 
                        refParentDetail={null}
                    />

                    <ModalOpinionDetailNew 
                        refOpinion={refOpinion} 
                        refParentDetail={null}
                    />
                </Content>

               
            </Layout>
        </Fragment>
    );
}