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
    Affix
} from 'antd';

import {
    ExclamationCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;
const { Sider, Content } = Layout;
const { Text, Link } = Typography;

import { FlowRouter } from 'meteor/kadira:flow-router';

import { OpinionDetails } from '/imports/api/collections/opinionDetails';

import { ModalOpinionDetail } from './modals/OpinionDetail';
import { ListOpinionDetailsLinkable } from './ListOpinionDetailsLinkable';
import { ActionCodeDropdown } from './components/ActionCodeDropdown';

export const DetailForm = ({refOpinion, refDetail}) => {
    const { detail, isLoading } = useTracker(() => {
        const noDataAvailable = { detail: {} };

        if (!Meteor.user()) {
            return noDataAvailable;
        }
        const handler = Meteor.subscribe('opinionDetail', { refOpinion, refDetail });
    
        if (!handler.ready()) {
            return { ...noDataAvailable, isLoading: true };
        }
    
        let detail;
        if (refDetail) {
            detail = OpinionDetails.findOne(refDetail);
        } else {
            detail = OpinionDetails.findOne({ refOpinion, refParentDetail: null });
        }

        return { detail, isLoading: false };
    });

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

    if (detail.type === "ANSWER" || detail.type === "QUESTION") {
        pageHeaderButtons.push(
            <ActionCodeDropdown
                key="3"
                refDetail={detail._id}
                actionCode={detail.actionCode}
            />
        )
    }
    pageHeaderButtons.push(
        <Button key="2"
            onClick={ e => { removeDetail(detail._id) } }
            icon={<DeleteOutlined />}
        >
            Löschen
        </Button>
    );
    pageHeaderButtons.push(
        <ModalOpinionDetail key="1"
            mode="EDIT"
            refOpinion={refOpinion}
            refDetail={detail._id}
        />
    );

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
                        title={detail.title}
                        extra={pageHeaderButtons}
                    />
                </div>
            </Affix>

            <Content>
                <div dangerouslySetInnerHTML={ {__html: detail.text}} />

                <ListOpinionDetailsLinkable
                    refOpinion={refOpinion} 
                    refParentDetail={refDetail}
                />
            </Content>
        </Fragment>
    );
}

export class OpinionBreadcrumb extends Component {
    constructor(props) {
        super(props);
        
        const {refOpinion, refDetail} = props;

        this.getBreadcrumbItems(refOpinion, refDetail);
    }

    state = {
        loading: true,
        items: []
    }

    getBreadcrumbItems(refOpinion, refDetail){
        Meteor.call('opinionDetail.getBreadcrumbItems', {refOpinion, refDetail}, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                this.setState({
                    items: result,
                    loading: false
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { refOpinion, refDetail } = this.props;

        if (prevProps.refOpinion !== refOpinion || prevProps.refDetail !== refDetail) {
            this.getBreadcrumbItems(refOpinion, refDetail);
        }
    }

    render() {
        const { items } = this.state;

        return (
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link href="/">Start</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/opinions">Gutachten</a>
                </Breadcrumb.Item>

                {items.map( (item, index) => {
                    const uri = `/opinions/${item.refOpinion}/${item._id}`
                    return (
                        <Breadcrumb.Item key={index}>
                            <Link href={uri}>{item.title}</Link>
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        );
    }
}

export const OpinionsDetailsFormLinkable = ({refOpinion, refDetail}) => {
    return (
        <Layout>
            <Content>
                <DetailForm refOpinion={refOpinion} refDetail={refDetail} />

                <ModalOpinionDetail
                    mode="NEW" 
                    refOpinion={refOpinion} 
                    refParentDetail={refDetail}
                />
            </Content>
        </Layout>
    );
}