import React, { Fragment, useState } from 'react';
import { Accounts } from 'meteor/accounts-base';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Divider from 'antd/lib/divider';
import Button from 'antd/lib/button';
import Space from 'antd/lib/space';
import message from 'antd/lib/message';

import ShareAltOutlined from '@ant-design/icons/ShareAltOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';

import { ModalBackground } from '../components/ModalBackground';
import { UserSearchInput } from '../components/UserSearchInput';

const { useForm } = Form;

export const ModalShareWith = ( { currentUser } ) => {
    const [ showModal, setShowModal ] = useState(false);
    const [ form ] = useForm();

    const closeDialog = e => {
        form.resetFields();
        setShowModal(false);
    }

    const showDialog = e => {
        e.preventDefault();

        setShowModal(true);
    }

    const handleOk = e => {
        form.validateFields().then( values => {
            closeDialog();
        });
    }

    return (
        <Fragment>
            <Button type="dashed" onClick={ showDialog }>
                <Space>
                    <ShareAltOutlined />
                    Dokument teilen
                </Space>
            </Button>

            { !showModal ? null :
                <ModalBackground>
                    <Modal
                        title={<span><ShareAltOutlined /> Dokument teilen</span>}
                        visible={ showModal }
                        onOk={ handleOk }
                        onCancel={ closeDialog }
                        maskClosable={false}
                    >
                        <p>Zum Teilen dieses Dokuments mit anderen Benutzern wählen Sie bitte den entsprechenden Benutzer aus. Sollte der Benutzer nicht gefunden werden, so können Sie diesen auch per E-Mail einladen.</p>

                        <Form
                            layout="vertical"
                            form={form}
                            //onFinish={handleOk}
                        >

                            <Form.Item
                                label="Benutzer"
                                name="user"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Bitte geben Sie das alte Passwort an.',
                                    },
                                ]}
                            >
                                <UserSearchInput refOpinion={'notsupported'} searchMethod="getAll" />
                            </Form.Item>

                            <Divider orientation="left">Benutzer per E-Mail einladen</Divider>

                            <Form.Item
                                label="E-Mail"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Bitte geben Sie Ihr neues Passwort ein.',
                                    },
                                ]}
                            >
                                <Input prefix={<UserAddOutlined />} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </ModalBackground>
            }
        </Fragment>
    );
}
