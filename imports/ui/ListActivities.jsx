import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState, useEffect, useRef} from 'react';
import { 
    Avatar,
    List,
    Input,
    Form,
    Button,
    Comment,
    Tooltip,
    Space
} from 'antd';

import { useTracker } from 'meteor/react-meteor-data';
import { Activities } from '/imports/api/collections/activities';

const {
    TextArea
} = Input;


import moment from 'moment';
import localization from 'moment/locale/de';

import { DiffDrawer } from './components/DiffDrawer';
import { ReplyTo } from './components/ReplyTo';

export const ListActivities = ( { refOpinion, refDetail } ) => {
    const { activities, isLoading } = useTracker(() => {
        const noDataAvailable = { activities: [] };

        if (!Meteor.user()) {
          return noDataAvailable;
        }
        
        const handler = Meteor.subscribe('activities', { refOpinion, refDetail });
    
        if (!handler.ready()) { 
            return { ...noDataAvailable, isLoading: true };
        }
    
        const activities = Activities.find({}).fetch();
        
        return { activities, isLoading: false };
    });

    const scrollToBottom = () => {
        activitiesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  
    const activitiesEndRef = useRef(null);
    useEffect(scrollToBottom, [activities]);

    return (
        <Fragment>
            <List
                className="comment-list"
                header={<strong>Aktivitäten</strong>}
                itemLayout="horizontal"
                dataSource={activities}
                renderItem={item => (
                    <li>
                        <Comment
                            actions={[
                                <ReplyTo refOpinion={refOpinion} item={item} />,
                                <span key="2">Like</span>,
                                <span key="3">Dislike</span>,
                            ]}
                            author={item.createdBy.firstName + ' ' + item.createdBy.lastName}
                            avatar={<Avatar>{item.createdBy.firstName.charAt(0) + item.createdBy.lastName.charAt(0)}</Avatar>}
                            content={
                                <div>
                                    {item.message}
                                    <Space />
                                    <DiffDrawer opinionDetailId={item.refDetail} changes={item.changes} />
                                </div>
                            }
                            datetime={
                                <Tooltip title={moment(item.createdAt).format('DD.MM.YYYY HH:mm')}>
                                    <span>{moment(item.createdAt).locale('de', localization).fromNow()}</span>
                                </Tooltip>
                            }
                        />
                    </li>
                )}
            />

            <Form>
                <Form.Item>
                    <TextArea rows={4} onChange={null} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" loading={false} onClick={null} type="primary">
                        Add Comment
                    </Button>
                </Form.Item>
            </Form>

            <div ref={activitiesEndRef} />
        </Fragment>
    );
}