import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Button,
    Select,
    Modal,
    Form,
    Input,
    DatePicker,
    Divider,
    ConfigProvider
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from '/imports/api/collections/roles';

const { Option } = Select;

/*const layout = {
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
};*/

import locale_deDE from 'antd/es/locale/de_DE';
import { UserSearchInput } from '../components/UserSearchInput';

export const ModalOpinionNew = ( props ) => {
    /*const { roles, isLoadingRoles } = useTracker(() => {
        const noDataAvailable = { roles: [] };

        if (!Meteor.user()) {
          return noDataAvailable;
        }
        const handler = Meteor.subscribe('roles');
    
        if (!handler.ready()) {
          return { ...noDataAvailable, isLoadingRoles: true };
        }
    
        const roles = Roles.find({}).fetch();
        return { roles, isLoadingRoles: false };
    });*/

    const [ showModalNewOpinion, setShowModalNewOpinion ] = useState(false);


    const [form] = Form.useForm();

    const handleModalNewOpinionOk = e => {
        form.validateFields().then( values => {
            // transform dateFromTill
            values.dateFrom = values.dateFromTill[0].toDate();
            values.dateTill = values.dateFromTill[1].toDate();
            delete values.dateFromTill;

            Meteor.call('opinion.insert', values, (err, res) => {
                if (err) {
                    // do somthing to show error
                    console.log(err);
                    return Modal.error({
                        title: 'Fehler',
                        content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                    });
                }

                form.resetFields();
                setShowModalNewOpinion(false);    
            });        
        }).catch( info => {
            console.log('Validate Failed:', info);
        });
    }

    const handleModalNewOpinionCancel = e => {
        form.resetFields();
        setShowModalNewOpinion(false);
    }

    const createNewGutachten = () => {
        setShowModalNewOpinion(true);
    }

    return (
        <Fragment>
            <Button
                type="dashed" block
                icon={<PlusOutlined />}
                onClick={createNewGutachten}>
                    Erstellen eines neuen Gutachten
            </Button>

            { !showModalNewOpinion ? null :
                <Modal
                    title="Neues Gutachten"
                    visible={showModalNewOpinion}
                    onOk={handleModalNewOpinionOk}
                    onCancel={handleModalNewOpinionCancel}
                >
                    <p>Zum Erstellen eines neuen Gutachten füllen Sie bitte die nachfolgenden Felder aus und bestätigen Sie den Dialog mit OK.</p>

                    <Form
                        //{...layout}
                        layout="vertical"
                        form={form}
                        onFinish={handleModalNewOpinionOk}
                    >
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
                            <Input placeholder="Eindeutiger Name des Gutachtens"/>
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

                        <Divider orientation="left" plain>Auftraggeber</Divider>

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
                            <Input placeholder="Firmenname"/>
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

                        <Divider orientation="left" plain>Weitere Informationen</Divider>

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
                    </Form>
                </Modal>
            }
        </Fragment>
    );
}
