import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Button,
    Tooltip,
    Drawer,
    Modal,
    Divider,
    notification
} from 'antd';

import { InfoCircleOutlined, RestOutlined } from '@ant-design/icons';

import Diff from 'react-stylable-diff';

import { isObject } from '../../api/helpers/basics';


export const DiffDrawer = ( { refOpinion, opinionDetailId, action, changes } ) => {
    const [visibleDiffDrawer, setVisibleDiffDrawer] = useState(false);

    const showDiffDrawer = () => {
        setVisibleDiffDrawer(true);
    }

    const closeDiffDrawer = () => {
        setVisibleDiffDrawer(false);
    }

    const restoreChange = (key, oldValue, newValue) => {
        const handleResult = (err, changes) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten.' + err.message
                });
            }
            
            if (changes) {
                notification.success({
                    message: 'Speichern ...',
                    description: 'Die Änderung wurde erfolgreich rückgängig gemacht.'
                });
            } else {
                notification.info({
                    message: 'Speichern ...',
                    description: 'Es wurden keine Änderungen durchgeführt da der aktuelle Datensatz identisch ist.'
                });
            }

            closeDiffDrawer();
        }

        if (key === 'participants') {
            if (action === 'INSERT') {
                Meteor.call('opinion.removeParticipant', refOpinion, newValue, handleResult);
            } else if (action === 'UPDATE') {
                Meteor.call('opinion.updateParticipant', refOpinion, oldValue, handleResult);
            } else if(action === 'REMOVE') {
                Meteor.call('opinion.addParticipant', refOpinion, oldValue, handleResult);
            }
        } else {
            // undo the current change
            let opinionDetail = {
                id: opinionDetailId,
                data: {
                    [key]: oldValue
                }
            }
            
            Meteor.call('opinionDetail.update', opinionDetail, handleResult);
        }
    }

    const renderChanges = () => {
        if (!changes || changes.length == 0) {
            return <div>Es sind keine Änderungen vorhanden.</div>
        }

        let i=0;
        return changes.map(item => {
            let { oldValue, newValue } = item;
            
            if (isObject(oldValue)) {
                oldValue = JSON.stringify(oldValue);
            }

            if (isObject(newValue)) {
                newValue = JSON.stringify(newValue);
            }

            return (
                <div key={i++} style={{paddingBottom:'36px'}}>                    
                    <Divider orientation="left">{item.message}</Divider>
                    { item.propName == "deleted" ? (item.newValue == true ? <div>gelöscht=Ja</div> : <div>gelöscht=Nein</div>) :
                        <Diff
                            //type="chars"
                            type="words"
                            inputA={oldValue || ''}
                            inputB={newValue || ''}
                        />
                    }
                    
                    <Button onClick={ e => restoreChange(item.propName, item.oldValue, item.newValue)} 
                        icon={<RestOutlined />}
                        style={{marginTop:'16px'}}
                    >
                        Änderung rückgängig machen
                    </Button>
                </div>
            );
        });
    }

    return (
        
        <Fragment>
            <Tooltip title="Details">
                <Button type="link" shape="circle" size="small" onClick={ _ => showDiffDrawer()} icon={<InfoCircleOutlined/>} />
            </Tooltip>

            { !visibleDiffDrawer ? null :
                <Drawer className="diff-drawer"
                    title="Details"
                    width={720}
                    onClose={closeDiffDrawer}
                    visible={visibleDiffDrawer}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={ _ => closeDiffDrawer()} style={{ marginRight: 8 }} type="primary">
                                OK
                            </Button>
                        </div>
                    }
                >
                    <h3>Nachfolgende Änderungen wurden durchgeführt.</h3>
                    { renderChanges() }
                </Drawer>
            }
        </Fragment>
    );
}