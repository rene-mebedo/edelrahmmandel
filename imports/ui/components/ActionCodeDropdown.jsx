import { Meteor } from 'meteor/meteor';

import React, { Fragment, useState } from 'react';
import { Button, Dropdown, Menu, Modal } from 'antd';

import { actionCodes } from '/imports/api/constData/actioncodes'; 


export const ActionCodeDropdown = ({refDetail, actionCode}) => {
    if (!actionCode) actionCode = 'unset';

    /*if (!actionCodes[actionCode]) {
        console.log('actionCode', actionCode);
        actionCode = 'unset';
    }*/
    const { color, text } = actionCodes[actionCode];

    const handleMenuClick = (e) => {
        Meteor.call('opinionDetail.update', { id: refDetail, data: { actionCode: e.key }}, (err, res) => {
            if (err) {
                return Modal.error({
                    title: 'Fehler',
                    content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                });
            }
        });
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            {
                Object.keys(actionCodes).map( k => {
                    const item = actionCodes[k];
                    return (
                        <Menu.Item key={k} style={{color:item.color}}>
                            {item.text}
                        </Menu.Item>
                    );
                })
            }
        </Menu>
    );
    
    return (
        <Dropdown trigger={['click']}  overlay={menu}>
            <Button className="dropdown-handlungsbedarf" style={{color, borderColor: color}} >{ text }</Button>
        </Dropdown>
    );
}
