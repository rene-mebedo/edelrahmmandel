import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState, useEffect, useRef} from 'react';

import { Modal, message, Space, Button, Divider, Tooltip } from 'antd';

import {
    CloseOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    DeleteOutlined, DeleteTwoTone,
    LikeOutlined, LikeTwoTone,
    DislikeOutlined, DislikeTwoTone,
    MessageOutlined,
    MenuOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    ScissorOutlined,
    CheckOutlined

} from '@ant-design/icons';

import { Summernote } from './Summernote';

import { AppState } from '../../client/AppState';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const MbacTooltip = props => {
    const { title, className, show, children } = props;

    if (show) return (
        <Tooltip className={className} title={title} >
            { children }
        </Tooltip>
    )
    
    return (
        <Fragment>
            { children }
        </Fragment>
    )
}

const FloatingActions = ({onSave, onCancel, onSocialClick, onCheckAnswer, onRemove, onFinallyRemove, isDeleted, isAnswer, likes, dislikes, canEdit = false, canFinallyRemove = false }) => {
    onSave = onSave || function(){};
    onCancel = onCancel || function(){};
    onCheckAnswer = onCheckAnswer || function(){};
    onSocialClick = onSocialClick || function(){};
    onRemove = onRemove || function(){};
    onFinallyRemove = onFinallyRemove || function(){};

    const doneBefore = arr => {
        const uid = Meteor.userId();
        
        return arr.filter( ({userId}) => userId == uid ).length > 0;
    }

    const listSocial = list => {
        return (
            <div className="mbac-tooltip-social-list">
                <ul className="ant-list">
                    {
                        list.map( ({userId, firstName, lastName}) => <li className="ant-list-item" key={userId}>{firstName + (firstName ? ' ':'') + lastName}</li>)
                    }
                </ul>
            </div> 
        );
    }

    return (
        <div className="mbac-floating-actions">

            <div className="mbac-additional-actions">
                <Space split={<Divider type="vertical" />}>
                    <MbacTooltip className="mbac-simple-social-list" title={listSocial(likes)} show={likes.length !== 0}>
                        <Space>
                            { doneBefore(likes)
                                ?<LikeTwoTone onClick={ e => onSocialClick('like') } />
                                :<LikeOutlined onClick={ e => onSocialClick('like') } />
                            }
                            <span>{likes.length}</span>
                        </Space>
                    </MbacTooltip>
                    <MbacTooltip className="mbac-simple-social-list" title={listSocial(dislikes)} show={dislikes.length !== 0} >
                        <Space>
                            { doneBefore(dislikes)
                                ?<DislikeTwoTone onClick={ e => onSocialClick('dislike') } />
                                :<DislikeOutlined onClick={ e => onSocialClick('dislike') } />
                            }
                            <span>{dislikes.length}</span>
                        </Space>
                    </MbacTooltip>

                    { canEdit && isAnswer ? <CheckOutlined onClick={onCheckAnswer} /> : null }
                    { canEdit ? (isDeleted ? <EyeInvisibleOutlined onClick={onRemove} /> : <EyeOutlined onClick={onRemove} />) : null }
                    
                    { canFinallyRemove ? <DeleteOutlined onClick={onFinallyRemove} /> : null }
                </Space>
            </div>
            <div className="mbac-primary-actions">
                { canEdit 
                    ?   <Space>
                            <Button type="primary" icon={<CheckOutlined />} /*size="large"*/ onClick={onSave}>Speichern</Button>
                            <Button type="dashed" icon={<CloseOutlined />} /*size="large"*/ onClick={onCancel}>Abbruch</Button>
                        </Space>
                    : <Button type="primary" onClick={onCancel}>OK</Button>
                }
            </div>
        </div>
    )
}

export const EditableContent = ( { item, type = 'span', className, value, method='opinionDetail.update', field, refDetail, permissions } ) => {
    const [ mode, setMode ] = useState('SHOW');    
    const inputRef = useRef('');

    const { canEdit, canDelete } = permissions;

    useEffect( () => {
        if (mode == 'EDIT') {
            if (type == 'wysiwyg') {
                inputRef.current.editor.summernote('code', value);
            } else {
                inputRef.current.innerText = value;
                inputRef.current.focus({cursor: 'all', preventScroll: true});
            }
        }
    }, [mode]);

    const exitEditmode = () => {
        AppState.editingDetail = null;
        delete AppState.editingDetail;        
        setMode('SHOW');
    }

    const toggleDeleted = () => {
        Meteor.call('opinionDetail.toggleDeleted', refDetail, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            } else {
                exitEditmode();
            }
        });
    }

    const finallyRemove = () => {
        Modal.confirm({
            title: 'Löschen',
            icon: <ExclamationCircleOutlined />,
            content: 'Soll der Eintrag wirklich gelöscht werden?',
            okText: 'OK',
            cancelText: 'Abbruch',
            onOk: closeConfirm => {
                closeConfirm();

                Meteor.call('opinionDetail.finallyRemove', refDetail, (err, res) => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                        });
                    } else {
                        exitEditmode();
                    }
                });
            }
        });
    }

    const checkAnswer = () => {
        Meteor.call('opinionDetail.checkAnswer', refDetail, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            }
            exitEditmode();
        });
    }

    const doSocial = action => {
        Meteor.call('opinionDetail.doSocial', action, refDetail, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            }
        });
    }

    const saveData = e => {
        let newValue;
        if (type == 'wysiwyg') {
            newValue = inputRef.current.editor.summernote('code');
        } else {
            newValue = inputRef.current.innerText;
        }
        
        // check for changes
        if (newValue === value) {
            return exitEditmode();
        }

        if (!newValue) {
            inputRef.current.focus({cursor: 'all', preventScroll: true});
            return message.error('Die Eingabe darf nicht leer sein.');
        }

        Meteor.call(method, { id: refDetail, data: { [field]: newValue }}, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            } else {
                exitEditmode();
            }
        });
    }

    const isDirty = () => {
        if (type == 'wysiwyg') {
            newValue = inputRef.current.editor.summernote('code');
        } else {
            newValue = inputRef.current.innerText;
        }
        
        // check for changes
        return (newValue !== value);
    }

    const editData = e => {
        if (!canEdit) return;

        if (AppState.editingDetail) {
            console.log(AppState.editingDetail);
            if (AppState.editingDetail.isDirty()) {
                return message.error('Bitte schließen Sie die aktuelle Bearbeitung ab bevor sie eine neue Stelle beginnen zu Bearbeiten.');
            }
            AppState.editingDetail.discardChanges();
        }
        setMode('EDIT');
        
        AppState.editingDetail = {
            _id: refDetail,
            discardChanges,
            saveData,
            isDirty
        }
    }

    const discardChanges = e => {
        exitEditmode();
    }

    const uploadImage = function(images, insertImage) {
        
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

    const PasteFromClipboard = e => {
        const bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
        
        e.preventDefault();
        document.execCommand('insertText', false, bufferText);
    }

    const PreparedFloatingActions = () => <FloatingActions
        onSave={saveData} 
        onCancel={discardChanges}
        onCheckAnswer={checkAnswer}
        onRemove={toggleDeleted}   
        onFinallyRemove={finallyRemove}
        onSocialClick={doSocial}
        isDeleted={item.deleted}
        isAnswer={item.type == 'ANSWER'}
        likes={item.likes}
        dislikes={item.dislikes}
        canEdit={canEdit}
        canFinallyRemove={canDelete}
    />;

    if (type == 'span') {
        if (mode=='EDIT') {
            return (
                <Fragment>
                    <Space>
                        <span ref={inputRef} className="mbac-editable-content" contentEditable="true" ></span>
                        <PreparedFloatingActions />
                    </Space>
                </Fragment>
            )
        }

        return (
            <span className="mbac-rendered-content" onClick={editData}>{value}</span>
        )
    } else if (type == 'wysiwyg') {
        if (mode=='EDIT') {
            return (
                <Fragment>
                    <Summernote
                        ref={inputRef}
                        className="mbac-editable-content mbac-wysiwyg"
                        onImageUpload={uploadImage}
                        onPaste={PasteFromClipboard}

                        options={{ airMode: true }}
                    />
                    <PreparedFloatingActions />
                </Fragment>
            )
        }

        return (
            <div className="mbac-rendered-content"
                onClick={editData}
                dangerouslySetInnerHTML={ {__html: value } }
            />
        )

    }

    return <div>UNKNOWN type: {type}</div>;
}