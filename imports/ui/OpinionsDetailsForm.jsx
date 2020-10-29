import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    PageHeader, 
    Breadcrumb,
    Collapse,
    Layout,
    Input,
    Form,
    Button,
} from 'antd';


import { FlowRouter } from 'meteor/kadira:flow-router';
import { useTracker } from 'meteor/react-meteor-data';

const { Panel } = Collapse;
const { Header, Footer, Sider, Content } = Layout;

function callback(key) {
  //console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


const {
    TextArea
} = Input;

import { Comment, Tooltip, List } from 'antd';
import moment from 'moment';

import { ModalOpinionDetailNew } from './modals/OpinionDetailNew';
import { ListOpinionDetails } from './ListOpinionDetails';
 
const data = [
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Marc Tomaschoff',
    avatar: 'https://mebedo-ac.de/wp-content/uploads/2020/10/Marc_Tomaschoff_MEBEDO-300x200.png',
    content: (
      <p>Gutachten erstellt.</p>
    ),
    datetime: (
      <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment().subtract(1, 'days').fromNow()}</span>
      </Tooltip>
    ),
  },
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Rene Schulte ter Hardt',
    avatar: 'https://mebedo-ac.de/wp-content/uploads/2018/09/schulte_ter_hardt_034-ae83fb2b-300x200.jpg',
    content: (
      <p>
        Kannst Du dieses Gutachten bitte noch mit Michael teilen.
      </p>
    ),
    datetime: (
      <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment().subtract(2, 'days').fromNow()}</span>
      </Tooltip>
    ),
  },
];

export const OpinionsDetailsForm = ({refOpinion}) => {
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

                    <Collapse onChange={callback}>
                        <Panel header="0. Allgemein" key="1">
                            <Collapse defaultActiveKey="1">
                                <Panel header="This is panel nest panel" key="1">
                                    <p>{text}</p>
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

                <Sider theme="light" width="300" collapsible collapsedWidth="0" reverseArrow>
                    <List
                        className="comment-list"
                        header={<strong>Aktivitäten</strong>}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <li>
                                <Comment
                                    actions={item.actions}
                                    author={item.author}
                                    avatar={item.avatar}
                                    content={item.content}
                                    datetime={item.datetime}
                                />
                            </li>
                        )}
                    />

                    <Form.Item>
                        <TextArea rows={4} onChange={null} />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" loading={false} onClick={null} type="primary">
                            Add Comment
                        </Button>
                    </Form.Item>
                </Sider>
            </Layout>
        </Fragment>
    );
}