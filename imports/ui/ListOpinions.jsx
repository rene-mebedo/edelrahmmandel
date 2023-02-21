import { Meteor } from 'meteor/meteor';
import React, { Fragment, useEffect, useState } from 'react';
import List from 'antd/lib/list';
import Space from 'antd/lib/space';
import Progress from 'antd/lib/progress';
import Tag from 'antd/lib/tag';
import Table from 'antd/lib/table';
import Modal from 'antd/lib/modal';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';

import ClearOutlined from '@ant-design/icons/ClearOutlined';
import Tooltip from 'antd/lib/tooltip';

import { useOpinions } from '../client/trackers';
import { MediaQuery, useMediaQueries } from '../client/mediaQueries';

const lower = a => {
    if (!a) return '';

    return a.toLowerCase();
}

export const ListOpinions = () => {
    const [ opinions, isLoading ] = useOpinions();

    const { isPhone, isTablet, isDesktop } = useMediaQueries();

    const deleteOpinion = id => {
        Modal.confirm({
            title: 'L Ö S C H E N',
            icon: <ExclamationCircleOutlined />,
            content: <span>Soll dieses Gutachten wirklich (für dich!) gelöscht werden?</span>,
            okText: 'OK',
            okType: 'danger',
            cancelText: 'Abbruch',
            onOk: closeConfirm => {
                closeConfirm();
                console.log( id );
                Meteor.call('opinions.unshareOpinionUser' , id , ( err ) => {
                    if ( err ) {
                        console.log( `Fehler beim Löschen des Gutachtens mit ID ${id}`, err );
                    }
                });
            }
        });
    }

    let columns = [
        {
            title: ' ',
            dataIndex: 'statusProgress',
            key: 'statusProgress',
            render: (text, row) => 
                <Space>
                    <Progress type="circle" percent={row.status == 'Angelegt' ? 2 : row.status == 'Bearbeitung' ? 25 : row.status == 'Korrektur' ? 50 : row.status == 'Vorabversion' ? 75 : row.status == 'Fertig' ? 100 : row.status == 'Ungültig' ? 100 : "?"}  width={35} status={row.status == 'Ungültig' ? "exception" : ""} />
                </Space>
        },
        {
            title: 'Titel',
            dataIndex: 'title',
            key: 'title',
            render: (text, row) => <a href={"/opinions/" + row._id}>
                <Tooltip title="Gutachten öffnen">
                    <Space>
                        {text}
                        {row.isTemplate ? <Tag color="green">Vorlage</Tag> : null}
                    </Space>
                </Tooltip>
            </a>,
            sorter: (a, b) => lower(a.title).localeCompare(lower(b.title)),
        },
        {
            title: 'Beschreibung',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => lower(a.description).localeCompare(lower(b.description)),
        },
        {
            title: '#Nr',
            dataIndex: 'opinionNo',
            key: 'opinionNo',
            sorter: (a, b) => lower(a.opinionNo).localeCompare(lower(b.opinionNo)),
            defaultSortOrder: 'descend'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => lower(a.status).localeCompare(lower(b.status))
        }
    ];

    if (isDesktop) {
        columns = columns.concat([
            {
                title: 'Kunde',
                dataIndex: 'customer',
                key: 'customer.name',
                render: (text, row) => row.customer.name,
                sorter: (a, b) => lower(a.customer.name).localeCompare(lower(b.customer.name)),
            },
            {
                title: 'Ort',
                dataIndex: 'customerCity',
                key: 'customer.city',
                render: (text, row) => row.customer.city,
                sorter: (a, b) => lower(a.customer.city).localeCompare(lower(b.customer.city)),
            },
        ]);
    }

    columns = columns.concat([
        {
            title: ' ',
            dataIndex: 'delete',
            key: 'delete',
            align:"right",
            render: (text, row) => {
                return <Space size='small'>
                {     
                    <Tooltip title="Gutachten (nur für dich!) löschen">
                        <ClearOutlined key="delete" onClick={_=>deleteOpinion( row._id )} />
                    </Tooltip>                             
                }
                </Space>
            }
        }
    ]);
    
    return (
        <Fragment>
            <MediaQuery showAtPhone={true}>
                <List
                    itemLayout="horizontal"
                    dataSource={opinions}
                    loading={isLoading}
                    renderItem={opinion => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <a href={"/opinions/" + opinion._id}>
                                        <Space>
                                            {opinion.title}
                                            {
                                                opinion.isTemplate
                                                    ? <Tag color="green">Vorlage</Tag>
                                                    : null
                                            }
                                        </Space>
                                    </a>}
                                description={('Nr. ' + opinion.opinionNo + ' - ' + opinion.description + ' - ' + opinion.customer.name + ', ' + opinion.customer.city)}
                            />
                        </List.Item>
                    )}
                />
            </MediaQuery>

            <MediaQuery showAtTablet={true} showAtDesktop={true}>
                <Table
                    columns={columns} 
                    dataSource={opinions} 
                    loading={isLoading}
                    rowKey="_id"
                    pagination={false}
                    showSorterTooltip={false}
                />
            </MediaQuery>
        </Fragment>
    );
}
