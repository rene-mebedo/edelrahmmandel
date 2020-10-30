import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Button,
    Select,
    Modal,
    Form,
    Input
} from 'antd';

import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';


import { useTracker } from 'meteor/react-meteor-data';
import { Layouttypes } from '/imports/api/collections/layouttypes';

import { OpinionDetails } from '/imports/api/collections/opinionDetails';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

export const ModalOpinionDetailEdit = ( { opinionDetailId }) => {
    const { layouttypes, isLoadingLayouttypes } = useTracker(() => {
        const noDataAvailable = { layouttypes: [] };

        if (!Meteor.user()) {
          return noDataAvailable;
        }
        const handler = Meteor.subscribe('layouttypes');
    
        if (!handler.ready()) {
          return { ...noDataAvailable, isLoadingLayouttypes: true };
        }
    
        const layouttypes = Layouttypes.find({}).fetch();
        return { layouttypes, isLoadingLayouttypes: false };
    });

    const [ showModal, setShowModal ] = useState(false);

    const [form] = Form.useForm();

    const handleModalOk = e => {
        form.validateFields().then( values => {
            Meteor.call('opinionDetail.update', { id: opinionDetailId, data: values}, (err, res) => {
                if (err) {
                    return Modal.error({
                        title: 'Fehler',
                        content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                    });
                }

                form.resetFields();
                setShowModal(false);    
            });
        }).catch( info => {
            Modal.error({
                title: 'Fehler',
                content: 'Es ist ein interner Fehler aufgetreten. ' + info
            });
        });
    }

    const handleModalCancel = e => {
        form.resetFields();
        setShowModal(false);
    }

    const showModalVisible = () => {
        const od = OpinionDetails.find(opinionDetailId).fetch();

        if (!od && !od[0]) {
            return Modal.error({
                title: 'Fehler',
                content: 'Es ist ein Fehler beim Lesen der Gutachtendetails aufgetreten. ' + err.message
            });
        }
        
        form.setFieldsValue({
            title: od[0].title,
            type: od[0].type,
            text: od[0].text
        });

        setShowModal(true);
    }

    return (
        <Fragment>
            <Button 
                onClick={ showModalVisible }
                shape="round" icon={<EditOutlined />} style={{marginBottom:'8px'}}
            />

            { !showModal ? null :
                <Modal
                    title="Bearbeite Detail zum Gutachten"
                    width="80%"
                    visible={ showModal }
                    onOk={ handleModalOk }
                    onCancel={ handleModalCancel }
                    cancelText="Abbruch"
                    //closable={false}
                    maskClosable={false}
                >
                    <p>Zum Erstellen neuer Details zu diesem Gutachten füllen Sie bitte die nachfolgenden Felder aus und bestätigen Sie den Dialog mit OK.</p>

                    <Form
                        //{...layout}
                        layout="vertical"
                        form={form}
                        onFinish={handleModalOk}
                    >
                        <Form.Item
                            label="Typ"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Bitte geben Sie einen Typ an.',
                                },
                            ]}
                        >
                            <Select style={{ width: 360 }} loading={isLoadingLayouttypes}>
                                { layouttypes.map (t => <Option key={t._id} value={t._id}>{t.title}</Option>) } 
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Titel"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Bitte geben Sie einen Namen für das Gutachten ein.',
                                },
                            ]}
                        >
                            <Input placeholder="Eindeutiger Name des Gutachtens"/>
                        </Form.Item>

                        <Form.Item
                            label="Text"
                            name="text"
                        >
                            <ReactQuill theme="snow" /> 
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </Fragment>
    );
}
