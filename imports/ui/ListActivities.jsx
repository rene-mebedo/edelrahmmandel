import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState, useEffect, useRef} from 'react';
import { 
    Avatar,
    List,
    Form,
    Button,
    Comment,
    Tooltip,
    Modal
} from 'antd';

import moment from 'moment';
import localization from 'moment/locale/de';

import { DiffDrawer } from './components/DiffDrawer';
import { ReplyTo } from './components/ReplyTo';
import { MentionsWithEmojis } from './components/MentionsWithEmojis';

import { useActivities } from '../client/trackers';


export const ListActivities = ( { refOpinion, refDetail } ) => {
    const [ activities, activitiesLoading ] = useActivities(refOpinion, refDetail);
    const [form] = Form.useForm();
    const activitiesEndRef = useRef(null);
    const [ currentTime, setTime ] = useState(new Date());


    useEffect( () => {
        activitiesEndRef.current.scrollIntoView({ behavior: "smooth" })
        
        const timer = setInterval( () => {
            setTime(new Date());
        }, 1000 * 60 /* 1x pro Minute*/);

        return function cleanup(){
            clearInterval(timer);
        }
    }, [activities]);
  
    const postMessage = () => {
        form.validateFields().then( values => {
            console.log(values);

            Meteor.call('activities.postmessage', refDetail, values.message.text, (err, res) => {
                if (err) {
                    return Modal.error({
                        title: 'Fehler',
                        content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                    }); 
                }
                form.resetFields();
            });
        }).catch( info => {
            
        });
    }

    const renderAnswers = answers => {
        if (!answers || answers.length == 0)
            return null;

        return (
            <List
                itemLayout="horizontal"
                dataSource={answers}
                renderItem={ item => (
                    <li>
                        <Comment                        
                            author={item.createdBy.firstName + ' ' + item.createdBy.lastName}
                            avatar={<Avatar>{item.createdBy.firstName.charAt(0) + item.createdBy.lastName.charAt(0)}</Avatar>}
                            content={
                                item.message
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
        );
    }

    return (
        <Fragment>
            <List
                className="comment-list"
                header={<strong>Aktivitäten</strong>}
                itemLayout="horizontal"
                dataSource={activities}
                loading={activitiesLoading}
                renderItem={item => (
                    <li>
                        <Comment
                            actions={[
                                <ReplyTo refOpinion={refOpinion} refActivity={item._id} />
                            ]}
                            author={ item.createdBy.firstName + ' ' + item.createdBy.lastName }
                            avatar={ <Avatar>{item.createdBy.firstName.charAt(0) + item.createdBy.lastName.charAt(0)}</Avatar> }
                            content={
                                <div>
                                    { item.message }
                                    { item.type == 'SYSTEM-LOG' 
                                        ? <DiffDrawer opinionDetailId={item.refDetail} changes={item.changes} />
                                        : null
                                    }
                                    { renderAnswers(item.answers) }
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

            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="Nachricht"
                    name="message"
                    rules={[
                        {
                            required: true,
                            message: 'Bitte geben Sie eine Nachricht ein.',
                        },
                    ]}                
                >
                    <MentionsWithEmojis
                        method="opinion.getSharedWith"
                        methodParams={refOpinion}
                    />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" loading={false} onClick={postMessage} type="primary">
                        Absenden
                    </Button>
                </Form.Item>
            </Form>

            <div ref={activitiesEndRef} />
        </Fragment>
    );
}