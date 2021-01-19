import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState, useEffect, useRef} from 'react';

import {
    PlusCircleOutlined
} from '@ant-design/icons';
import { Modal, Form, Select, message, Dropdown, Menu } from 'antd';
import { useLayouttypes } from '../../../client/trackers';
import { AppState } from '../../../client/AppState';
import { layouttypesObject, selectableLayouttypes } from '../../../api/constData/layouttypes';
const { Option } = Select;

/*const defaultValuesByType = {
    HEADING: { title: 'X', printTitle: 'Überschrift' },
    TEXT: { title: 'T', text: 'Text' },
    QUESTION: { title: 'Q', printTitle:'Frage', text: 'Zusatztext', actionText: 'Maßnahmentext', actionCode: 'unset' },
    ANSWER: { title: 'A', printTitle:'Antwort', text: 'Antworttext', actionText:'Handlungsempfehlungstext', actionCode: 'okay' },
    BESTIMMUNGEN: { title: 'B', printTitle:'Bestimmungstitel', text: 'Bestimmungen' },
    HINT: { title: 'H', printTitle:'Hinweistitel', text: 'Hinweistext' },
    INFO: { title: 'I', printTitle:'Infotitel', text: 'Infotext' },
    IMPORTANT: { title: 'IM', printTitle:'Titel', text: 'Wichtigtext' },
    RECOMMENDATION: { title: 'E', printTitle:'Empfehlungstitel', text: 'Empfehlungstext' },
    NOTE: { title: 'N', printTitle:'Hinweistitel', text: 'Hinweistext' },
    REMARK: { title: 'R', printTitle:'Anmerkungstitel', text: 'Anmerkungstext' },
    ATTENTION: { title: 'AT', printTitle:'Achtungstitel', text: 'Achtungstext' },
    DEFINITION: { title: 'D', printTitle:'Definitionstitel', text: 'Definitionstext' },
}
*/
/*

const ModalTypeSelector = ({ onOk, onCancel }) => {
    const [ layouttypes, isLoadingLayouttypes ] = useLayouttypes();
    const [ form ] = Form.useForm();

    const handleOkay = () => {
        form.validateFields().then( ({type}) => {
            onOk && onOk(type);
        });
    }

    return (
        <Modal
            title="Neues Detail erstellen"
            visible={ true }
            onOk={ handleOkay }
            onCancel={ onCancel }
            maskClosable={false}
        >
            <p>Zum Erstellen eines neuen Details wählen Sie bitte den Typ aus und bestätigen mit Okay.</p>

            <Form
                layout="vertical"
                form={form}
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
                    <Select autoFocus loading={isLoadingLayouttypes}>
                        { layouttypes.map (t => <Option key={t._id} value={t._id}>{t.title}</Option>) } 
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}
*/
export const OpinionDetailAdder = ({pseudoItem, item, permissions, after}) => {
    const [ newPosition, setNewPositon ] = useState(null);
    const data = pseudoItem || item;
        
    const canDoAdd = () => {
        // while editing a opiniondetail this function is disabled
        if (AppState.editingDetail) {
            if (AppState.editingDetail.isDirty()) {
                message.warning('Sie befinden sich aktuell in der Bearbeitung. Bitte schließen Sie diesen Vorgang zuerst ab.');
                return false;
            }
            AppState.editingDetail.discardChanges();
        }
        return true;
    }

    const addNewItemBefore = e => {
        if (!canDoAdd()) return;

        if (pseudoItem) {
            setNewPositon(1);
            return;
        }

        const newPos = item.position;
        setNewPositon(newPos);
    }

    const addNewItemAfter = e => {
        if (!canDoAdd()) return;

        const newPos = item.position + 1;
        setNewPositon(newPos);
    }

    const createItem = type => {
        const { defaultValues } = layouttypesObject[type];

        Meteor.call('opinionDetail.insert', {
            refOpinion: data.refOpinion,
            refParentDetail: data.refParentDetail,
            position: newPosition,
            ...defaultValues,
            type
        }, (err, res) => {
            console.log(err,res);
        })

        closeModal();
    }

    const closeModal = () => {
        setNewPositon(null);
    }
    
    const menuClick = ({ item, key, keyPath, domEvent }) => {
        //console.log(key) //, keyPath, domEvent)
        createItem(key);
    }

    const menu = (
        <Menu onClick={menuClick}>
            {   
                selectableLayouttypes.map( ({_id, title}) => {
                    return (
                        <Menu.Item key={_id}>
                            {title}
                        </Menu.Item>
                    )
                })
            }
        </Menu>
    );
      
    return (
        <Fragment>           
           
            <div className={`mbac-action-plus mbac-action-add depth-${data.depth}`}>
                <Dropdown overlay={menu} 
                    //visible={newPosition !== null} 
                    trigger={['click']}
                 >
                    <PlusCircleOutlined 
                        onClick={after ? addNewItemAfter:addNewItemBefore}
                    />  
                </Dropdown>   
            </div>  
            
            { /*newPosition === null ? null :
                <ModalTypeSelector
                    onOk={createItem}
                    onCancel={closeModal}
                />*/
            }
        </Fragment>
    )
}