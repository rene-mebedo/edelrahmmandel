import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import React from 'react';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Divider from 'antd/lib/divider';
import Modal from 'antd/lib/modal';
import Space from 'antd/lib/space';

import UserOutlined from '@ant-design/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

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

export const ForgotPassword = () => {

    const forgotPassword = data => {
        const username = data.username && data.username.toLowerCase();

        Accounts.forgotPassword({email:username}, err => {
            if (err) {
                return Modal.error({
                    title: 'Das hat nicht funktioniert',
                    content: 'Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.',
                });  
            }

            Modal.success({
                title: 'EMail versandt',
                content: 'Wir haben Ihnen einen Link an Ihre EMailadresse gesandt. Bitte betätigen Sie diesen um Ihr Passwort erneut zu vergeben.',
            });
        });
    };

  return (
    <Row>
      <Col xs={2} sm={2} md={4} lg={6} xl={8} />
        
      <Col xs={20} sm={20} md={16} lg={12} xl={8} id="Login">
        <Divider orientation="left">Passwort vergessen</Divider>
        <p>
          So etwas kann passieren :)
        </p>
        <p>
          Bitte geben Sie Ihre E-Mail Adresse ein. Wir senden Ihnen einen Link per E-Mail, über den Sie ein
          neues Passwort vergeben können.
        </p>
        <Form
          {...layout}
          name="LoginForm"
          
          onFinish={forgotPassword}
        >
          <Form.Item
              label="Benutzername"
              name="username"
              rules={[
                  {
                  required: true,
                  message: 'Bitte geben Sie Ihren Benutzernamen ein.',
                  },
              ]}
          >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Benutzer"/>
          </Form.Item>

          <Form.Item {...tailLayout}>
              <Space split={<Divider type="vertical" />} size="large">
                  <Button type="primary" htmlType="submit">
                      Reset Passwort
                  </Button>
              </Space>
              
          </Form.Item>
        </Form>
      </Col>
      
      <Col xs={2} sm={2} md={4} lg={6} xl={8} />
       
    </Row>
    
  );
};