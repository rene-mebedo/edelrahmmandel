import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import React, { Fragment } from 'react';

import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import Space from 'antd/lib/space';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import Tooltip from 'antd/lib/tooltip';

import CloseOutlined from '@ant-design/icons/CloseOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import LikeOutlined from '@ant-design/icons/LikeOutlined';
import LikeTwoTone from '@ant-design/icons/LikeTwoTone';
import DislikeOutlined from '@ant-design/icons/DislikeOutlined'; 
import DislikeTwoTone from '@ant-design/icons/DislikeTwoTone';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseSquareOutlined from '@ant-design/icons/CloseSquareOutlined';
import FileDoneOutlined from '@ant-design/icons/FileDoneOutlined';
import FileUnknownOutlined from '@ant-design/icons/FileUnknownOutlined';

import { Summernote } from './Summernote';
import { ActionCodeDropdown } from './ActionCodeDropdown';
import { actionCodes } from '../../api/constData/actioncodes';

import { AppState, getAppState, setAppState } from '../../client/AppState';


export class ReadPicTextContent extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Fragment>
                <div>
                    <div className={`mbac-could-styled-as-deleted`}
                        dangerouslySetInnerHTML={ {__html: this.props.value } }
                    />
                </div>
            </Fragment>
        )
    }
}