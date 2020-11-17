import { Meteor } from 'meteor/meteor';

import React, { Fragment, useState } from 'react';
import { Button, Dropdown, Menu, Modal, Tag } from 'antd';

import { actionCodes } from '/imports/api/constData/actioncodes'; 


export const ActionCodeTag = ({refDetail, actionCode}) => {
    if (!actionCode) actionCode = 'unset';

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
        <Tag color={color}>{text}
            { 
                //<Button className="dropdown-handlungsbedarf" style={{color, borderColor: color}} >{ text }</Button> 
            }
        </Tag>
    );
}
