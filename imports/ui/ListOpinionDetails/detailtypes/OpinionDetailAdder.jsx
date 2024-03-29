import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState } from 'react';

import message from 'antd/lib/message';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';

import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';

import { getAppState, useAppState } from '../../../client/AppState';
import { layouttypesObject, selectableLayouttypes } from '../../../api/constData/layouttypes';

export const OpinionDetailAdder = ({pseudoItem, item, permissions, after}) => {
    const { canEdit } = permissions;
    // no permission, no DetailAdder :-)
    if (!canEdit) return null;

    const [ newPosition, setNewPositon ] = useState(null);
    const [ selectedDetail ] = useAppState('selectedDetail');

    const [ previewUrl, setPreviewUrl ] = useAppState('previewUrl');
    const [ previewUrlBusy, setPreviewUrlBusy ] = useAppState('previewUrlBusy');

    const data = pseudoItem || item;

    const canDoAdd = () => {
        // while editing a opiniondetail this function is disabled
        if (selectedDetail) {
            if (selectedDetail.isDirty()) {
                message.warning('Sie befinden sich aktuell in der Bearbeitung. Bitte schließen Sie diesen Vorgang zuerst ab.');
                return false;
            }
            selectedDetail.discardChanges();
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
            if (err) console.log(err,res)

            if (!err) {
                if (getAppState('livePdfPreview')) {
                    setPreviewUrlBusy(true);
                    Meteor.call('opinion.createPDF', data.refOpinion, 'livepreview', (err, url) => {
                        setPreviewUrlBusy(false);
                        if (!err) setPreviewUrl(url);
                    });
                }
            }
        })

        closeModal();
    }

    const closeModal = () => {
        setNewPositon(null);
    }
    
    const menuClick = ({ item, key, keyPath, domEvent }) => {
        createItem(key);
    }

    const items = selectableLayouttypes.map( ({_id, title}) => {
        return (
            {
                key: _id,
                label: title
            }
        )
    })

    const menuProps = {
        items,
        onClick: menuClick
    };
    
    return (
        <Fragment>           
           
            <div className={`mbac-action-plus mbac-action-add ${selectedDetail ? 'mbac-edit-mode-active':''} depth-${data.depth}`}>
                <Dropdown menu={menuProps}
                    trigger={['click']}
                 >
                    <PlusCircleOutlined 
                        onClick={after ? addNewItemAfter:addNewItemBefore}
                    />  
                </Dropdown>   
            </div>  
        </Fragment>
    )
}