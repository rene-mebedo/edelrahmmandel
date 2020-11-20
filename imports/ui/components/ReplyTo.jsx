import React, { Fragment, useState } from 'react';
import { Form, Button } from 'antd';
import { MentionsWithEmojis } from './MentionsWithEmojis';

const { useForm } = Form;



export const ReplyTo = ( { refOpinion, refActivity } ) => {
    const [ showInput, setShowInput ] = useState(false);
    const [ form ] = useForm();
    
    const toggleShowInput = () => { setShowInput(!showInput); }

    const onAnswerClick = () => {
        form.validateFields().then( values => {
            console.log(values)
            Meteor.call('activities.replyTo', refOpinion, refActivity, values.answer, (err, res) => {
                console.log(err,res)
                toggleShowInput();
            });
        }).catch( err => {
            // ignore
            console.log('catch', err);
        });
    }

    return (
        <Fragment>
            <span key="1" onClick={ toggleShowInput }>Antworten</span>
            { !showInput ? null : 
                <Form form={form}>
                    <Form.Item
                        name="answer"
                        rules={[
                            {
                                required: true,
                                message: 'Bitte geben Sie eine Antwort ein.',
                            },
                        ]}
                    >
                        <MentionsWithEmojis 
                            method="opinion.getSharedWith"
                            methodParams={refOpinion}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={onAnswerClick} loading={false} type="primary">
                            Antworten
                        </Button>
                    </Form.Item>
                </Form>
            }
        </Fragment>
    );
}