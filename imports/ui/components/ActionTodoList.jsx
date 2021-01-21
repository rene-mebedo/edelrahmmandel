import React from 'react';
import Table from 'antd/lib/table';
import Tag from 'antd/lib/tag';

import { actionCodes } from '../../api/constData/actioncodes';
import { useOpinionActionList } from '../../client/trackers';

export const ActionTodoList = ({refOpinion}) => {
    const [ actionListitems, isLoading ] = useOpinionActionList(refOpinion);
    
    const cols = [
        {
            title: 'Maßnahme',
            dataIndex: 'actionCode',
            key: 'actionCode',
            width: 250,
            render: code => <Tag color={actionCodes[code].color}>{actionCodes[code].text}</Tag>
        }, {
            title: 'Text',
            dataIndex: 'actionText',
            key: 'actionText',
            render: (actionText, record) => <a href={`/opinions/${record.refOpinion}/${record._id}`}>{actionText}</a>,
        }
    ];
    
    let groupedItems = [];
    Object.keys(actionCodes).forEach( code => {
        const filteredItems = actionListitems.filter( item => item.actionCode === code);
        if (filteredItems.length > 0) {
            groupedItems.push({
                key: code,
                actionCode: code,
                children: filteredItems
            });
        }
    });

    return (
        <Table 
            dataSource={groupedItems} 
            columns={cols} 
            pagination={false}
            loading={isLoading}
        />
    )
}