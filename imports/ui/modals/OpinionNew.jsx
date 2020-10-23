import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Button,
    Select,
    Modal,
    Form,
    Input,
    DatePicker
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTracker } from 'meteor/react-meteor-data';
import { RolesCollection } from '/imports/api/roles';

const { Option } = Select;

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

export const ModalOpinionNew = ( props ) => {
    const { roles, isLoadingRoles } = useTracker(() => {
        const noDataAvailable = { roles: [] };

        if (!Meteor.user()) {
          return noDataAvailable;
        }
        const handler = Meteor.subscribe('roles');
    
        if (!handler.ready()) {
          return { ...noDataAvailable, isLoadingRoles: true };
        }
    
        const roles = RolesCollection.find({}).fetch();
        return { roles, isLoadingRoles: false };
    });

    const [ showModalNewOpinion, setShowModalNewOpinion ] = useState(false);


    const [form] = Form.useForm();

    const handleModalNewOpinionOk = e => {
        form.validateFields()
            .then((values) => {
                Meteor.call('opinion.insert', {
                    title: 'Marcs Welthandelsgesellschaft mbH - 3745', 
                    description: 'Unser erstes Gutachten per client-Befehl'
                }, (err, res) => {
                    console.log('Finish:', err, res);
                });

                form.resetFields();
                setShowModalNewOpinion(false);
            }).catch((info) => {
                console.log('Validate Failed:', info);
            }
        );
        
        //return false;

        /*Meteor.call('opinion.insert', {
            title: 'Marcs Welthandelsgesellschaft mbH - 3745', 
            description: 'Unser erstes Gutachten per client-Befehl'
        }, (err, res) => {
            console.log('Finish:', err, res);
        });

        setShowModalNewOpinion(false);*/
    }

    const handleModalNewOpinionCancel = e => {
        form.resetFields();
        setShowModalNewOpinion(false);
    }

    const createNewGutachten = () => {
        setShowModalNewOpinion(true);
    }

/*    Rolle:
    <Select style={{ width: 120 }} loading={isLoadingRoles}>
        { roles.map (role => <Option key={role._id} value={role._id}>{role.rolename}</Option>) } 
    </Select>*/

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
                        {...layout}
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
                            <DatePicker.RangePicker />
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </Fragment>
    );
}
