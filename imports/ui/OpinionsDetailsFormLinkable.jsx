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


import { OpinionDetails } from '/imports/api/collections/opinionDetails';
import { layouttypesObject } from '/imports/api/constData/layouttypes';

import { ModalOpinionDetail } from './modals/OpinionDetail';
import { ListOpinionDetailsLinkable } from './ListOpinionDetailsLinkable';
import { ActionCodeDropdown } from './components/ActionCodeDropdown';
import { hasPermission } from '../api/helpers/roles';

import { 
    useOpinionSubscription,
    useOpinionDetail
} from '../client/trackers';


export const DetailForm = ({refOpinion, refDetail}) => {
    const opinionIsLoading = useOpinionSubscription(refOpinion);

    const [detail, detailIsLoading] = useOpinionDetail(refOpinion, refDetail);

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
            </Space>
        ];
    } else {
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
    }

    const renderStepText = ({type, stepText}) => {
        if (type === "ANSWER" || type === "QUESTION") {
            if (!stepText) {
                return (
                    <Button type="dashed">Bitte legen Sie noch eine Maßnahme fest</Button>
                );
            } else {
                return (
                    <div>
                        {stepText}
                    </div>
                );
            }
        } else {
            return null;
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
                        title={detailIsLoading ? <Spin /> : detail.title}
                        extra={pageHeaderButtons}
                    />
                </div>
            </Affix>

            <Content>
                { detailIsLoading ? <Skeleton paragraph={{ rows: 4 }} /> :
                    <Descriptions 
                        layout="horizontal" size="small"  
                        //column={{ xxl: 4, xl: 4, lg: 2, md: 2, sm: 1, xs: 1 }}
                        bordered
                    >
                        <Descriptions.Item label="Sortierung">
                            <Tag color="blue">{detail.orderString}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Typ">{layouttypesObject[detail.type || 'UNKNOWN'].title}</Descriptions.Item>
                        <Descriptions.Item label="Maßnahme">
                            <ActionCodeDropdown
                                key="3"
                                refDetail={detail._id}
                                actionCode={detail.actionCode}
                            />
                        </Descriptions.Item>

                        <Descriptions.Item label="Maßnahme (Text)">
                            Irgend ein langer Text der unter Punkt 8 eingetragen wir als Maßnahme.
                            Zu bewerten ist die Relevanz und die Einschätzung des Kunden.
                            {detail.stepText}
                        </Descriptions.Item>
                        <Descriptions.Item label="Titel" span={2}>{detail.title}</Descriptions.Item>

                        <Descriptions.Item label="Text" span={2}>
                            <div dangerouslySetInnerHTML={ {__html: detail.text}} />
                        </Descriptions.Item>
                    </Descriptions>
                }

                { /*renderStepText(detail)*/ }

                <Divider orientation="left">Details zu diesem Punkt</Divider>

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
                console.log('result', result);
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
/*<Breadcrumb.Item>
                    <Link href="/">Start</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/opinions">Gutachten</a>
                </Breadcrumb.Item>*/
        return (
            <Breadcrumb>
                {items.map( ({ title, uri }, index) => {
                    //const uri = `/opinions/${item.refOpinion}/${item._id}`
                    return (
                        <Breadcrumb.Item key={index}>
                            <Link href={uri}>{title}</Link>
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        );
    }
}

export const OpinionsDetailsFormLinkable = ({refOpinion, refDetail, currentUser}) => {
    return (
        <Layout>
            <Content>
                <DetailForm refOpinion={refOpinion} refDetail={refDetail} />

                { !hasPermission({currentUser}, 'opinion.create') ? null :
                    <ModalOpinionDetail
                        mode="NEW" 
                        refOpinion={refOpinion} 
                        refParentDetail={refDetail}
                    />
                }
            </Content>
        </Layout>
    );
}