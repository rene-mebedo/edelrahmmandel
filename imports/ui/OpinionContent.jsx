import React, { Fragment, useEffect, useRef, useState } from 'react'

import Descriptions from 'antd/lib/descriptions';
import Skeleton from 'antd/lib/skeleton';
import Tag from 'antd/lib/tag';
import Table from 'antd/lib/table';
import Space from 'antd/lib/space';
import Tabs from 'antd/lib/tabs';
import Result from 'antd/lib/result';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Spin from 'antd/lib/spin';
import Affix from 'antd/lib/affix';
import InputNumber from 'antd/lib/input-number';

import Typography from 'antd/lib/typography';
const { Paragraph, Text } = Typography;

import ShareAltOutlined from '@ant-design/icons/ShareAltOutlined';
import FileDoneOutlined from '@ant-design/icons/FileDoneOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import FormOutlined from '@ant-design/icons/FormOutlined';
import FilePdfOutlined from '@ant-design/icons/FilePdfOutlined';
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import ImportOutlined from '@ant-design/icons/ImportOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';

import { useOpinion, useOpinionDetails, useOpinionDetailsSpellcheck, useOpinionPdfs } from '../client/trackers';

import { OpinionParticipants } from './components/OpinionParticipants';
import { OpinionVariables } from './components/OpinionVariables';
import { ModalOpinion } from './modals/Opinion';
import { Expert } from './components/Expert';

import filesize from 'filesize';
import moment from 'moment';
import { useAppState } from '../client/AppState';

import { pdfjs, Document, Page } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { TabPane } = Tabs;

export const OpinionSpellcheckList = ({refOpinion, currentUser, canEdit=false, canDelete=false, children, onTabPaneChanged}) => {
    const [opinionDetailsSpellcheck, spellcheckLoading] = useOpinionDetailsSpellcheck(refOpinion)

    return (
        <Table
            //bordered
            size="small"
            loading={spellcheckLoading}
            pagination={false}
            dataSource={opinionDetailsSpellcheck}
            rowKey="_id"
            showHeader={false}
            columns={[
                {
                    title: 'Pos.',
                    dataIndex: 'pos',
                    key: 'pos',
                    render: (text, item) => {
                        if (item.refParentDetail === null)
                            return <div style={{width:50}} ><a href={`/opinions/${refOpinion}?activitiesBy=${item._id}`}>
                                {'' + (item.printParentPosition || '') + item.printPosition}
                            </a></div>

                        return <div style={{width:50}} ><a href={`/opinions/${refOpinion}/${item.refParentDetail}?activitiesBy=${item._id}`}>
                            {'' + (item.printParentPosition || '') + item.printPosition}
                        </a></div>
                    }
                }, {
                    title: 'Text',
                    dataIndex: 'printTitle',
                    key: 'printTitle',
                    render: (printTitle, item) => <Fragment>
                        {printTitle 
                            ? <Text 
                                style={{ width:800 }}
                                ellipsis={true}>
                                    { printTitle }
                              </Text>
                            : null
                        }
                        { printTitle ===  item.text ? null :
                            <Text
                                style={{ width:800 }}
                                ellipsis={true}
                            >
                                { item.text && item.text.replace(/(<([^>]+)>)/gi, "") }
                            </Text>
                        }
                    </Fragment>
                }
            ]}
        />
    )
}

export const OpinionContent = ({refOpinion, currentUser, canEdit=false, canDelete=false, canCancelShareWith=false, children, onTabPaneChanged}) => {
    const [ opinion, isLoading ] = useOpinion(refOpinion);
    const [ pdfs, isPdfLoading ] = useOpinionPdfs(refOpinion);

    onTabPaneChanged = onTabPaneChanged || function(){};

    const [ selectedDetail ] = useAppState('selectedDetail');

    const [ livePdfPreview ] = useAppState('livePdfPreview');
    const [ previewUrl ] = useAppState('previewUrl');
    const [ previewUrlBusy ] = useAppState('previewUrlBusy');
    
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(2);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    if (isLoading) {
        return (
            <Skeleton paragraph={{ rows: 4 }} />
        );
    } else if (!opinion) {
        return <Result
            status="403"
            title="Zugriff verweigert"
            subTitle="Das Gutachten kann nicht angezeigt werden, da Sie nicht berechtigt sind."
            extra={<Button type="primary" onClick={() => history.back()}>Zurück</Button>}
        />;
    }

    const disableTabPanes = (selectedDetail && selectedDetail.mode == 'EDIT');

    const cancelSharedWith = shd => {
        Modal.confirm({
            title: 'Löschen',
            icon: <ExclamationCircleOutlined />,
            content: <span>Soll der Benutzer <strong>{shd.user.firstName} {shd.user.lastName}</strong> für dieses Dokument "entfernt" werden?</span>,
            okText: 'OK',
            cancelText: 'Abbruch',
            onOk: closeConfirm => {
                closeConfirm();

                Meteor.call('users.cancelShareWith', refOpinion, shd.user.userId, (err, result) => {
                    if (err) {
                        console.log('Fehler beim remove des Benutzers', err);
                    }
                });
            }
        });
    }

    console.log('PreviewUrl update:', previewUrl);

    function onItemClick({ pageNumber: itemPageNumber }) {
        setPageNumber(itemPageNumber);
      }

    return (
        <Tabs onChange={onTabPaneChanged} size="large" tabPosition={window.innerWidth > 800 ? 'left':'top'}>
            <TabPane tab={<span><FormOutlined />Dokument</span>} key="DOCUMENT">
                { !livePdfPreview ? children :
                    <Row gutter={8}>
                        <Col key="firstCol" span={12}>
                            {children}
                        </Col>
                        <Col key="secondCol" span={12}>
                            <Affix offsetTop={120}>
                                <div key="pager"
                                    style={{marginBottom:16, textAlign:'center'}}
                                >
                                    { previewUrlBusy ? <Space /> :
                                        <Space>
                                            <span>Seite <InputNumber min={1} defaultValue={pageNumber} value={pageNumber} max={numPages} onChange={value => { setPageNumber( value )}} /> von {numPages}</span>
                                        </Space>
                                    }
                                </div>
                                <div key="content"
                                    //style={{position:'fixed', marginTop:32}}
                                    //style={{border:'1px solid #eee'}}
                                >
                                    { previewUrlBusy ? <Spin /> : 
                                        <Document
                                            file={previewUrl}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            onItemClick={onItemClick}
                                        >
                                            <Page key={'p'+pageNumber} pageNumber={pageNumber} />
                                        </Document>
                                    }
                                </div>
                            </Affix>
                            {/*
                            <div style={{position:'fixed', marginBottom:16}}>
                                <Space>
                                    <Button onClick={ () => {setPageNumber(pageNumber-1)} }>vorherige Seite</Button>
                                    <span>Seite {pageNumber} von {numPages}</span>
                                    <Button onClick={ () => {setPageNumber(pageNumber+1)} }>nächste Seite</Button>
                                </Space>
                            </div>
                            <div style={{position:'fixed', marginTop:32}}>
                                <Document
                                    file={previewUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onItemClick={onItemClick}
                                >
                                    { previewUrlBusy ? <Spin /> : <Page pageNumber={pageNumber} />}
                                </Document>
                            </div>*/
                            }
                        </Col>
                    </Row>
                }
                {/*children*/}
            </TabPane>

            <TabPane disabled={disableTabPanes} tab={<span><ContactsOutlined />Allgemein</span>} key="GENERAL">
                { !opinion.isTemplate ? null :
                    <p><Tag size="large" color="green">Vorlage</Tag></p>
                }

                <Descriptions 
                    layout="vertical"
                    size="small"
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                >
                    <Descriptions.Item label="Titel">{opinion.title} Nr. {opinion.opinionNo}</Descriptions.Item>
                    <Descriptions.Item label="Beschreibung">{opinion.description}</Descriptions.Item>
                    
                    <Descriptions.Item label="Kunde" span={2}>
                        <div>{opinion.customer.name}</div>
                        <div>{opinion.customer.street}</div>
                        <div>{opinion.customer.postalCode + ' ' + opinion.customer.city}</div>
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Datum von">{moment(opinion.dateFrom).format('DD. MMMM YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Datum bis">{moment(opinion.dateTill).format('DD. MMMM YYYY')}</Descriptions.Item>

                    { opinion.isTemplate ? null :  /* keine Teilnehmer und Gutachter in einer Vorlage */
                        <Fragment>
                            <Descriptions.Item label="Teilnehmer" span={2}>
                                <OpinionParticipants 
                                    refOpinion={refOpinion} 
                                    participants={opinion.participants} 
                                    currentUser={currentUser} 
                                    canEdit={canEdit} 
                                    canDelete={canDelete} 
                                />
                            </Descriptions.Item>

                            <Descriptions.Item label="Gutachter 1">
                                { opinion.expert1 
                                    ? <Expert user={opinion.expert1} />
                                    : <ModalOpinion 
                                            mode='EDIT' refOpinion={refOpinion} 
                                            buttonCaption="Jetzt Gutachter festlegen" 
                                            buttonType="dashed"
                                            defaultTab="Erweitert"
                                    />
                                }
                            </Descriptions.Item>

                            <Descriptions.Item label="Gutachter 2">
                                <Expert user={opinion.expert2} />
                            </Descriptions.Item>
                        </Fragment>
                    }
                    <Descriptions.Item label="Fotografiererlaubnis vorhanden">{!!!opinion.disableCopyright ? 'Ja, vorhanden' : 'Nein, nicht vorhanden'}</Descriptions.Item>
                </Descriptions>
            </TabPane>

            <TabPane tab={<span><ImportOutlined />Variablen</span>} key="VARS" disabled={disableTabPanes} >
                <OpinionVariables
                    refOpinion={refOpinion}
                    data={opinion.userVariables || []} 
                    permissions={{canEdit, canDelete}}
                />
            </TabPane>

            <TabPane tab={<span><FilePdfOutlined />PDF</span>} key="PDF" disabled={disableTabPanes} >
                <Table
                    //bordered
                    size="small"
                    loading={isPdfLoading}
                    pagination={false}
                    dataSource={pdfs}
                    rowKey="_id"
                    showHeader={false}
                    columns={[
                        {
                            title: 'Titel',
                            dataIndex: 'title',
                            key: 'title',
                            render: (text, item) => <a href={item.link} target="_blank">
                                <Space><FilePdfOutlined /><span>Gutachtliche Stellungnahme</span></Space>
                            </a>
                        }, {
                            title: 'Erstellt am',
                            dataIndex: 'meta.createdAt',
                            key: 'createdAt',
                            render: (text, item) => moment(item.meta.createdAt).format('DD.MM.YYYY HH:mm:ss')
                        }, {
                            title: 'Erstellt von',
                            dataIndex: 'meta.createdBy',
                            key: 'createdBy',
                            render: (text, item) => {
                                if (!item.meta.createdBy) return 'Unbekannt';
                                
                                const { firstName, lastName } = item.meta.createdBy;
                                
                                return `${firstName} ${lastName}`
                            }
                        }, {
                            title: 'Größe',
                            dataIndex: 'size',
                            key: 'size',
                            align:"right",
                            render: size => filesize(size)
                        }, {
                            title: 'Status',
                            dataIndex: '_id',
                            key: '_id',
                            align:"center",
                            render: (_id, item, index) => <Space>
                                <Tag color={item.meta.preview ? "red" : (index==0?"green":"orange")}>{item.meta.preview ? 'temp. Vorschau' : (index == 0 ? 'Aktuell':'Entwurf')}</Tag>
                                <Tag color="blue">v{pdfs.length - index}</Tag>
                            </Space>
                        }
                    ]}
                />
            </TabPane>

            <TabPane tab={<span><FileDoneOutlined />Spellcheck</span>} key="SPELLCHECK" disabled={disableTabPanes} >
                <OpinionSpellcheckList refOpinion={refOpinion} currentUser={currentUser} />
            </TabPane>

            <TabPane tab={<span><ShareAltOutlined />geteilt mit</span>} key="SHARE" disabled={disableTabPanes}>
                <Table
                    size="small"
                    loading={false}
                    pagination={false}
                    dataSource={opinion.sharedWith}
                    rowKey={ shw => shw.user.userId }
                    showHeader={false}
                    columns={[
                        {
                            title: 'Benutzer',
                            dataIndex: 'title',
                            key: 'title',
                            render: (text, shw) => {
                                const { userId, firstName, lastName } = shw.user;
                                return <Expert key={userId} user={{userId, firstName, lastName}} />
                            }
                        }, {
                            title: 'Rolle',
                            dataIndex: 'role',
                            key: 'role',
                            render: (text, shd) => <Tag color="orange">{shd.role}</Tag>
                        }, {
                            title: 'Rolle',
                            dataIndex: 'role',
                            key: 'role',
                            align: 'right',
                            render: (text, shw) => {
                                const { userId, firstName, lastName } = shw.user;

                                return <Space size='large'>
                                    {//<EditOutlined key="edit" />
                                    }
                                    { !canCancelShareWith || Meteor.userId() === userId ? null :
                                        <DeleteOutlined key="remove" onClick={_=>cancelSharedWith(shw)} />
                                    }
                                </Space>
                            }
                        }
                    ]}
                />
            </TabPane>
        </Tabs>
    )
}