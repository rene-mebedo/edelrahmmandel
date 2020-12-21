import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Button,
    Select,
    Modal,
    Form,
    Input,
    Space,
    Upload,
    message
} from 'antd';

import { PictureOutlined, InboxOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

import { useTracker } from 'meteor/react-meteor-data';
import { Layouttypes } from '/imports/api/collections/layouttypes';
import { OpinionDetails } from '/imports/api/collections/opinionDetails';

import { Images } from '/imports/api/collections/images';
import { useImages } from '../../client/trackers';

const { Option } = Select;

import { ModalBackground, preventClickPropagation } from '../components/ModalBackground';

/*
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
*/
export const ModalFileUpload = ( { mode/*NEW||EDIT*/, refOpinion, refParentDetail, refDetail }) => {
    const [ images, imagesLoading ] = useImages();
    const [ showModal, setShowModal ] = useState(false);

    //const [form] = Form.useForm();

    const closeModal = e => {
        //form.resetFields();
        setShowModal(false);
    }

    const showModalVisible = (e) => {
        // prevent collapse-trigger to react/launch
        e.stopPropagation();        

        setShowModal(true);
    }
    
    const ActionButton = () => {
        if (mode === "EDIT") {
            return (
                <Button type="dashed" onClick={ showModalVisible }>
                    <Space>
                        <PictureOutlined />
                        Bilder
                    </Space>
                </Button>
            );
        }
    }

    const doUpload = (file) => {
        //console.log('doUpload', file);

        const upload = Images.insert({
            file,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            //someOtherStuff: 'Hallo Welt'
        }, false);
    
        upload.on('start', function () {
            //console.log('upload start', this)
        });

        upload.on('end', function (error, fileObj) {
            //console.log('upload end', error, fileObj)
            if (error) {
                message.error(`Fehler beim Upload: ${error}`);
                //console.log(`Error during upload: ${error}`);
            } else {
                //console.log(`File "${fileObj.name}" successfully uploaded`);
                const data = {
                    refOpinion,
                    refParentDetail: refDetail, // the new parent is the current detail
                    type: 'PICTURE',
                    title: fileObj.name,
                    orderString: '01000',
                    files: [fileObj]
                }
                Meteor.call('opinionDetail.insert', data, (err, res) => {
                    if (err) {
                        message.error(`${err.message} file upload failed.`);
                    }
                });
            }
            
            
        });

        upload.start();
    }

    const props = {
        name: 'file',
        multiple: true,
        action: doUpload,
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            //console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            //message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            //message.error(`${info.file.name} file upload failed.`);
          }
        },
    };

    return (
        <Fragment>
            <ActionButton />

            { !showModal ? null :
                <ModalBackground>
                    <Modal
                        className="mbac-modal-upload-pictures"
                        title="Bilder Hinzufügen"
                        //width="80%"
                        visible={ showModal }
                        onOk={ closeModal }
                        onCancel={ closeModal }
                        cancelButtonProps={{className:"mbac-btn-cancel"}}
                        okText="Schließen"
                        maskClosable={false}
                        onClick={ preventClickPropagation }
                    >
                        <Upload.Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Bitte hier klicken oder per "Drag And Drop" entsprechende Dateien hier ablegen.
                            </p>
                            
                            <p className="ant-upload-hint">
                                Die angefügten Bilder werden jeweils als neuer Detailpunkt abgelegt.
                            </p>
                            
                        </Upload.Dragger>
                    </Modal>
                </ModalBackground>
            }
        </Fragment>
    );
}