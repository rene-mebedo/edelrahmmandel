import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Divider from 'antd/lib/divider';
import Modal from 'antd/lib/modal';
import notification from 'antd/lib/notification';

import UserOutlined from '@ant-design/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

import { FlowRouter } from 'meteor/kadira:flow-router';


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

export const ResetPassword = ({ token }) => {
    const [ verifing, setVerifing ] = useState(false);

    const resetPassword = data => {
        const {newPassword, repeatPassword} = data;

        if (newPassword !== repeatPassword) {
            return Modal.warning({
                title: 'Fehler',
                content: 'Die Passwortwiederholung ist fehlgeschlagen. Bitte überprüfen Sie Ihre Angaben.'
            });
        }
        
        setVerifing(true);
        
        Accounts.resetPassword(token, newPassword, err => {
            if (err) {
                setVerifing(false);
                return Modal.error({
                    title: 'Fehler',
                    content: 'Die Änderung des Passworts ist fehlgeschlagen.\n' + err.message,
                });
            }

            notification.success({
                message: 'Passwortänderung...',
                description: 'Die Änderung wurde erfolgreich durchgeführt. Sie werden umgehend am System angemeldet.'
            });

            setTimeout(() => {
                FlowRouter.go('/opinions');
            }, 2000);
        });
    };

    return (
        <Row>
            <Col xs={2} sm={2} md={4} lg={6} xl={8} />
        
            <Col xs={20} sm={20} md={16} lg={12} xl={8} id="Login">
                <Divider orientation="left">Reset Passwort</Divider>
                <p>Passwort vergessen?!</p>
                <p>
                    Hier ändern Sie nun Ihr Passwort für Ihren <strong>MEBEDO GutachtenPlus</strong> - Zugang.
                </p>
                <Form
                    {...layout}
                    name="LoginForm"
                    onFinish={resetPassword}
                >
                    <Form.Item
                        label="Passwort"
                        name="newPassword"
                        rules={[
                            {
                            required: true,
                            message: 'Bitte geben Sie Ihr Passwort ein.',
                            },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Passwort"/>
                    </Form.Item>

                    <Form.Item
                        label="Bestätigung"
                        name="repeatPassword"
                        rules={[
                            {
                            required: true,
                            message: 'Bitte bestätigen Sie Ihr Passwort.',
                            },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Bestätigung"/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" loading={verifing}>
                            Passwort ändern
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
      
            <Col xs={2} sm={2} md={4} lg={6} xl={8} />
       
        </Row>
    )
};