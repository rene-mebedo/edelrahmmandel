import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Avatar,
    List,
    Space,
    Tag
} from 'antd';

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
                        description={opinion.description}
                    />
                </List.Item>
                )}
            />
        </Fragment>
    );
}