import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import List from 'antd/lib/list';
import Space from 'antd/lib/space';
import Tag from 'antd/lib/tag';

import { useOpinions } from '../client/trackers';

export const ListOpinions = () => {
    const [ opinions, isLoading ] = useOpinions();

    return (
        <Fragment>
            <List
                itemLayout="horizontal"
                dataSource={opinions}
                loading={isLoading}
                renderItem={opinion => (
                    <List.Item>
                        <List.Item.Meta
                            //avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
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
                            //description={opinion.description}
                            description={('Nr. ' + opinion.opinionNo + ' - ' + opinion.description + ' - ' + opinion.customer.name + ', ' + opinion.customer.city)}
                        />
                    </List.Item>
                )}
            />
        </Fragment>
    );
}