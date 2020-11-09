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


export const DiffDrawer = ( { opinionDetailId, changes } ) => {
    const [visibleDiffDrawer, setVisibleDiffDrawer] = useState(false);

    const showDiffDrawer = () => {
        setVisibleDiffDrawer(true);
    }

    const closeDiffDrawer = () => {
        setVisibleDiffDrawer(false);
    }

    const restoreChange = (key, oldValue) => {
        // undo the current change
        let opinionDetail = {
            id: opinionDetailId,
            data: {
                [key]: oldValue
            }
        }
        
        Meteor.call('opinionDetail.update', opinionDetail, (err, changes) => {
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
        });
    }

    const renderChanges = () => {
        if (!changes || changes.length == 0) {
            return <div>Es sind keine Änderungen vorhanden.</div>
        }

        let i=0;
        return changes.map(item => {
            return (
                <div key={i++} style={{paddingBottom:'36px'}}>                    
                    <Divider orientation="left">{item.message}</Divider>
                    { item.propName == "deleted" ? (item.newValue == true ? <div>gelöscht=Ja</div> : <div>gelöscht=Nein</div>) :
                        <Diff
                            //type="chars"
                            type="words"
                            inputA={item.oldValue}
                            inputB={item.newValue}
                        />
                    }
                    
                    <Button onClick={ e => restoreChange(item.propName, item.oldValue)} 
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