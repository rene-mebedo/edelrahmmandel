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
import { Layouttypes } from '/imports/api/collections/layouttypes';

//import ReactQuill from 'react-quill';
//import 'react-quill/dist/quill.snow.css';
import { Summernote } from '../components/Summernote';

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

export const ModalOpinionDetailNew = ( { refOpinion, refParentDetail }) => {
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
            values.refOpinion = refOpinion;
            values.refParentDetail = refParentDetail;       

            Meteor.call('opinionDetail.insert', values, (err, res) => {
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
            //console.log('Validate Failed:', info);
        });
    }

    const handleModalCancel = e => {
        form.resetFields();
        setShowModal(false);
    }

    const showModalVisible = () => {
        setShowModal(true);
    }

    const uploadImage = function(images, insertImage) {
        console.log('onImageUpload', images);
        /* FileList does not support ordinary array methods */
        for (let i = 0; i < images.length; i++) {
            /* Stores as bas64enc string in the text.
             * Should potentially be stored separately and include just the url
             */
            const reader = new FileReader();

            reader.onloadend = () => {
                insertImage(reader.result);
            };

            reader.readAsDataURL(images[i]);
        }
    }
    
    return (
        <Fragment>
            <Button
                style={{marginTop:24}}
                type="dashed" block
                icon={<PlusOutlined />}
                onClick={ showModalVisible }>
                    Erstellen eines neuen Detailpunkt
            </Button>

            { !showModal ? null :
                <Modal
                    title="Neue Details zum Gutachten"
                    width="80%"
                    visible={ showModal }
                    onOk={ handleModalOk }
                    onCancel={ handleModalCancel }
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
                            label="Sortierung"
                            name="orderString"
                            rules={[
                                {
                                    required: true,
                                    message: 'Bitte geben Sie einen Wert für die Sortierung an.',
                                },
                            ]}
                        >
                            <Input placeholder="Sortierung" style={{width:150}}/>
                        </Form.Item>

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
                            <Input placeholder="Eindeutiger Titel des Gutachtendetails"/>
                        </Form.Item>

                        <Form.Item
                            label="abw. Titel (im Druck)"
                            name="printTitle"
                        >
                            <Input placeholder="Nur einzugeben wenn dieser im Druck abweichend ist zum o.g. Titel"/>
                        </Form.Item>

                        <Form.Item
                            label="Text"
                            name="text"
                        >
                            <Summernote
                                className="summernote-airmode"
                                onImageUpload={uploadImage}
                                options={ { airMode: true } }
                            />
                            
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </Fragment>
    );
}

//<ReactQuill theme="snow" /> 