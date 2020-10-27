import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Avatar,
    List
} from 'antd';

import { useTracker } from 'meteor/react-meteor-data';
import { Opinions } from '/imports/api/collections/opinions';

export const ListOpinions = () => {

    const { opinions, isLoadingOpinions } = useTracker(() => {
        const noDataAvailable = { opinions: [] };

        if (!Meteor.user()) {
          return noDataAvailable;
        }
        const handler = Meteor.subscribe('opinions', Meteor.userId());
    
        if (!handler.ready()) { 
            console.log('not ready')
          return { ...noDataAvailable, isLoadingOpinions: true };
        }
    
        const opinions = Opinions.find({}).fetch();
        console.log('ready', opinions);
        return { opinions, isLoadingOpinions: false };
    });

    return (
        <Fragment>
            <List
                itemLayout="horizontal"
                dataSource={opinions}
                loading={isLoadingOpinions}
                renderItem={opinion => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href={"/opinions/" + opinion._id}>{opinion.title}</a>}
                        description={opinion.description}
                    />
                </List.Item>
                )}
            />
        </Fragment>
    );
}