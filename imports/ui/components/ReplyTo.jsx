import React, {Fragment, useState} from 'react';
import { 
    Input,
    Form,
    Button,
    Mentions
} from 'antd';

const {
    TextArea
} = Input;

import {MentionsEmojisEditor} from './MentionsEmojisEditor';


const emojis = [0x1F600, 0x1F604, 0x1F34A, 0x1F344, 0x1F37F, 0x1F363, 0x1F370, 0x1F355,
    0x1F354, 0x1F35F, 0x1F6C0, 0x1F48E, 0x1F5FA, 0x23F0, 0x1F579, 0x1F4DA,
    0x1F431, 0x1F42A, 0x1F439, 0x1F424];

export const ReplyTo = ( { refOpinion, item } ) => {
    const [textareaVisible, setTextareaVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [prefix, setPrefix] = useState("@");
    
    let idle = false;

    const [form] = Form.useForm();

    const replyTo = (e, item) => {
        
    }

    const showTextarea = () => {
        setTextareaVisible(true);
    }

    const onSearch = (text, prefix) => {
        setPrefix(prefix);
        console.log(text, prefix);

        if (idle) return;
        if (!text) return;

        idle = true;
        setTimeout( _ => {
            setPrefix(prefix);
            setLoading(true);
            console.log('refOpinion', refOpinion);
            Meteor.call('opinion.getSharedWith', refOpinion, text, (err, sharedWithUsers) => {
                setLoading(false);
                idle = false;

                if (!err) {
                    setUsers(sharedWithUsers);
                    console.log(err, sharedWithUsers);
                }
            });
        }, 500)
    }

    const onSelect = (option, prefix) => {
        console.log(option, prefix);
    }

    const onAnswerClick = () => {
        form.validateFields().then( values => {
            console.log(values)
        });
        console.log('Tset');
    }

    return (
        <Fragment>
            <span key="1" onClick={ e => showTextarea()}>Antworten</span>
            { !textareaVisible ? null : 
                <Form form={form}>
                    <Form.Item>
                        <Mentions prefix={['@',':']} autoSize={true} loading={loading} onSearch={onSearch} onSelect={onSelect}>
                            {prefix == '@' ?
                                users.map(({ userId, firstName, lastName }) => (
                                    <Option key={userId} value={firstName + ' ' + lastName} >
                                        {firstName + ' ' + lastName} 
                                    </Option>
                                ))
                            :
                                emojis.map((codePoint, index) => (
                                    <Option key={index} value={String.fromCodePoint(codePoint)} >{String.fromCodePoint(codePoint)}</Option>
                                ))
                            }
                        </Mentions>

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

/*

<MentionsEmojisEditor />

                        <Mentions prefix={['@',':']} autoSize={true} loading={loading} onSearch={onSearch} onSelect={onSelect}>
                            {prefix == '@' ?
                                users.map(({ userId, firstName, lastName }) => (
                                    <Option key={userId} value={firstName + ' ' + lastName} >
                                        {firstName + ' ' + lastName} 
                                    </Option>
                                ))
                            :
                                emojis.map((codePoint, index) => (
                                    <Option key={index} value={String.fromCodePoint(codePoint)} >{String.fromCodePoint(codePoint)}</Option>
                                ))
                            }
                        </Mentions>
*/