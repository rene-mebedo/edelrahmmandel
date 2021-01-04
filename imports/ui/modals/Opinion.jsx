import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    ConfigProvider,
    Tabs,
    Switch
} from 'antd';

import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

import locale_deDE from 'antd/es/locale/de_DE';
import { UserSearchInput } from '../components/UserSearchInput';
import { useOpinion } from '../../client/trackers';
import { ModalBackground } from '../components/ModalBackground';
import moment from 'moment';
import { create } from 'domain';
import { OpinionSearchInput } from '../components/OpinionSearchInput';

const { useForm } = Form;

export const ModalOpinion = ( { mode /*EDIT|NEW*/, refOpinion, buttonCaption, buttonType, defaultTab, createTemplate} ) => {
    const [ opinion, isLoading ] = useOpinion(refOpinion);
    const [ showModal, setShowModal ] = useState(false);

    const [ form ] = useForm();

    const handleResult = (err, res) => {
        if (err) {
            // do somthing to show error
            return Modal.error({
                title: 'Fehler',
                content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
            });
        }

        form.resetFields();
        setShowModal(false);    
    }

    const handleOk = e => {
        form.validateFields().then( values => {
            if (values.dateFromTill) {
                // transform dateFromTill
                values.dateFrom = values.dateFromTill[0].toDate();
                values.dateTill = values.dateFromTill[1].toDate();
                delete values.dateFromTill;
            }

            if (mode === 'EDIT') {
                Meteor.call('opinion.update', refOpinion, values, handleResult);
            } else {
                if (createTemplate) {
                    values.isTemplate = true;
                }
                Meteor.call('opinion.insert', values, handleResult);
            }
        }).catch( info => {
            console.log('Validate Failed:', info);
        });
    }

    const handleCancel = e => {
        form.resetFields();
        setShowModal(false);
    }

    const handleShow = e => {
        setShowModal(true);

        if (mode === 'EDIT') {
            setTimeout(() => {
                const dateFromTill = [ moment(opinion.dateFrom), moment(opinion.dateTill) ];
                //console.log('Opinion', opinion);
                form.setFieldsValue({ ...opinion, dateFromTill });
            }, 10);
        }
    }

    const btnType = buttonType || (mode === 'EDIT' ? 'primary' : 'dashed');
    const btnCaption = buttonCaption || (mode === 'EDIT' ? 'Bearbeiten' : 'Neues Gutachten erstellen');

    return (
        <Fragment>
            <Button
                type={ btnType }
                icon={ mode === 'EDIT' ? <EditOutlined /> : <PlusOutlined />}
                onClick={ handleShow }
            >
                {btnCaption}
            </Button>

            { !showModal ? null :
                <ModalBackground>
                    <Modal
                        title={ mode === 'EDIT' ? 'Gutachten Bearbeiten' : 'Neues Gutachten' }
                        visible={ showModal }
                        onOk={ handleOk }
                        onCancel={ handleCancel }
                        maskClosable={false}
                    >
                        { mode === 'EDIT'
                            ? <p>Zum Bearbeiten des Gutachten führen Sie bitte Ihre Änderungen in den jeweiligen Feldern durch und bestätigen Sie den Dialog mit OK.</p>
                            : <p>Zum Erstellen eines neuen Gutachten füllen Sie bitte die nachfolgenden Felder aus und bestätigen Sie den Dialog mit OK.</p>
                        }

                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={handleOk}
                        >

                            <Tabs defaultActiveKey={defaultTab || "Allgemein"} style={{ minHeight: 300 }}>
                                <TabPane tab="Allgemein" key="Allgemein">
                                    <Form.Item
                                        label="Gutachten"
                                        name="title"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bitte geben Sie einen Namen für das Gutachten ein.',
                                            },
                                        ]}
                                    >
                                        <Input autoFocus placeholder="Eindeutiger Name des Gutachtens"/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Beschreibung"
                                        name="description"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bitte geben Sie eine kurze Beschreibung zu diesem Gutachten ein.',
                                            },
                                        ]}
                                    >
                                        <Input.TextArea placeholder="Beschreibung" autoSize={{minRows:3}} />
                                    </Form.Item>

                                    <ConfigProvider locale={locale_deDE}>
                                        <Form.Item
                                            label="Zeitraum"
                                            name="dateFromTill"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Bitte geben Sie den Zeitraum des Gutachtens an.',
                                                },
                                            ]}
                                        >
                                            <DatePicker.RangePicker format="DD.MM.YYYY"/>
                                        </Form.Item>
                                    </ConfigProvider>

                                    { mode === 'EDIT' ? null :
                                        <Form.Item
                                            label="Vorlage"
                                            name="refTemplate"
                                        >
                                            <OpinionSearchInput />
                                        </Form.Item>
                                    }
                                </TabPane>

                                <TabPane tab="Kunde" key="Kunde">
                                    <Form.Item
                                        label="Firma"
                                        name={['customer', 'name']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bitte geben Sie den Firmenname des Auftraggebers ein.',
                                            },
                                        ]}
                                    >
                                        <Input autoFocus placeholder="Firmenname"/>
                                    </Form.Item>
                                    
                                    <Form.Item
                                        label="Straße"
                                        name={['customer', 'street']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bitte geben Sie die Straße des Auftraggebers an.',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Straße"/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Postleitzahl"
                                        name={['customer', 'postalCode']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bitte geben Sie die Postleitzahl des Auftraggebers an.',                                    
                                            },
                                            {
                                                len: 5,
                                                message: 'Bitte geben Sie eine 5-stellig Postleitzahl ein.', 
                                            },
                                        ]}
                                    >
                                        <Input placeholder="PLZ"/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Ort"
                                        name={['customer', 'city']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Bitte geben Sie den Ort des Auftraggebers an.',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Ort"/>
                                    </Form.Item>
                                </TabPane>

                                { mode !== 'EDIT' ? null :
                                    <TabPane tab="Erweitert" key="Erweitert">
                                        <Form.Item
                                            label="Gutachter 1"
                                            name="expert1"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Bitte geben Sie einen Gutachter an.',
                                                },
                                            ]}
                                        >
                                            <UserSearchInput 
                                                autoFocus={true}
                                                placeholder="Gutachter 1"
                                                refOpinion={refOpinion}
                                                searchMethod="getExperts"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Gutachter 2"
                                            name="expert2"
                                        >
                                            <UserSearchInput 
                                                placeholder="Gutachter 2"
                                                refOpinion={refOpinion}
                                                searchMethod="getExperts"
                                            />
                                        </Form.Item>
                                    </TabPane>
                                }
                            </Tabs>

                        </Form>
                    </Modal>
                </ModalBackground>
            }
        </Fragment>
    );
}
