import { Meteor } from 'meteor/meteor';

import React, { Fragment, useState } from 'react';
import { Button, Dropdown, Menu, Modal } from 'antd';

import { actionCodes } from '/imports/api/constData/actioncodes'; 
import DownOutlined from '@ant-design/icons/DownOutlined';

/*
export const ActionCodeDropdown = props => {
    if (props.value === undefined) return null;

    const { autoUpdate=true, refDetail, value, onChange } = props;
    const [val, setVal] = useState(value);

    if (!val) {
        setVal('unset');
        return null;
    }

    const { color, text } = actionCodes[val];

    const handleMenuClick = (e) => {
        if (autoUpdate){
            Meteor.call('opinionDetail.update', { id: refDetail, data: { actionCode: e.key }}, (err, res) => {
                if (err) {
                    return Modal.error({
                        title: 'Fehler',
                        content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                    });
                }
            });
        }

        setVal(e.key);
        if (onChange) onChange(e.key);
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
}*/



export class ActionCodeDropdown extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            value: props.value || 'unset'
        }

        const items = Object.keys(actionCodes).map( k => {
            const item = actionCodes[k];
            return (
                {
                    key: k,
                    label: item.longtext,
                    style:{color:item.color}
                }
            );
        })
    
        const menuProps = {
            items,
            onClick: this.handleMenuClick.bind(this)
        };

        this.menu = menuProps;
    }

    handleMenuClick = (e) => {
        const { autoUpdate = true, refDetail, onChange } = this.props;

        if (autoUpdate){
            Meteor.call('opinionDetail.update', { id: refDetail, data: { actionCode: e.key }}, (err, res) => {
                if (err) {
                    return Modal.error({
                        title: 'Fehler',
                        content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                    });
                }
            });
        }

        this.setState({value: e.key});
        if (onChange) onChange(e.key);
 
        this.waitForComponentDidUpdate = true;
    }

    componentDidUpdate(prevProps) {
        if (this.waitForComponentDidUpdate) {
            this.waitForComponentDidUpdate = false;
            return;
        }

        if (prevProps.value !== this.props.value) {
            // value changed from outside the component
            this.setState({
                value: this.props.value
            });
        }
    }
    
    render() {
        const { color, longtext } = actionCodes[this.state.value];
        const className = `mbac-actioncode-dropdown ${this.props.className}`;
        
        return (
            <Dropdown menu={this.menu} className={className} trigger={['click']} >
                <Button type="text" style={{color}} >
                    {longtext} <DownOutlined />
                </Button>
            </Dropdown>
        );
    };
}