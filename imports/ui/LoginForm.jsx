import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Form, Input, Button, Row, Col, Divider, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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

export const LoginForm = () => {

  const login = data => {
    Meteor.loginWithPassword(data.username, data.password, err => {
      if (err) {
        Modal.error({
          title: 'Login fehlgeschlagen',
          content: 'Bitte überprüfen Sie Ihren Benutzernamen und/oder Passwort und versuchen Sie es erneut.',
        });  
      }
    });
  };

  return (
    <Row>
      <Col xs={2} sm={2} md={4} lg={6} xl={8} />
        
      <Col xs={20} sm={20} md={16} lg={12} xl={8} id="Login">
        <Divider orientation="left">Login</Divider>
        <p>
          Herzlich Willkommen zum MEBEDO GutachtenPlus!
        </p>
        <p>
          Bitte melden Sie sich mit Ihren Benutzerdaten an oder registrieren Sie 
          sich falls Sie noch keine Zugangsdaten haben.
        </p>
        <Form
          {...layout}
          name="LoginForm"
          
          onFinish={login}
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

          <Form.Item
              label="Passwort"
              name="password"
              rules={[
                  {
                  required: true,
                  message: 'Bitte geben Sie Ihr Passwort ein.',
                  },
              ]}
          >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Passwort"/>
          </Form.Item>

          <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                  Anmelden
              </Button>
          </Form.Item>
        </Form>
      </Col>
      
      <Col xs={2} sm={2} md={4} lg={6} xl={8} />
       
    </Row>
    
  );
};