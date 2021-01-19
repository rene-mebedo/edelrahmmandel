import React, {Fragment, useState, useEffect, useRef} from 'react';
import { AppState } from '../../client/AppState';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { message, Modal } from 'antd';

import { ExclamationCircleOutlined } from '@ant-design/icons';

export const Link = props => {
    const { href, children, onClick, canCancel } = props;

    const go = () => {
        if (onClick) {
            if (onClick() === false) return;
        }
        if (href) FlowRouter.go(href);
    }

    const discardAndGo = () => {
        const { discardChanges } = AppState.editingDetail;

        discardChanges();
        go();        
    }

    const checkEditing = e => {
        e.preventDefault();

        if (AppState.editingDetail) {
            if (canCancel) {
                const { isDirty } = AppState.editingDetail;

                if (isDirty()) {
                    Modal.confirm({
                        title: 'Änderungen verwerfen',
                        icon: <ExclamationCircleOutlined />,
                        content: 'Sie bearbeiten gerade einen Text. Möchten Sie die Änderungen verwerfen?',
                        okText: 'Okay',
                        cancelText: 'Abbruch',
                        onOk: discardAndGo
                    });
                } else {
                    discardAndGo();
                }
            } else {
                message.warning('Sie befinden sich aktuell in der Bearbeitung. Bitte schließen Sie diesen Vorgang zuerst ab.');
            }
            return;
        }
        go();
    }

    return (
        <a onClick={checkEditing}>
            {children}
        </a>
    )
}