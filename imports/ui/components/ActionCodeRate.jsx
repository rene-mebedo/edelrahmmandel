import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, {Fragment, useState} from 'react';
import { Button, Modal, Rate, Row, Col, Collapse, Space, Typography, List } from 'antd';

import { actionCodes } from '/imports/api/constData/actioncodes'; 

import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
};

export const ActionCodeRate = ({refDetail, actionCode}) => {
    if (!actionCode) actionCode = 'unset';

    const { color, text } = actionCodes[actionCode];
    const [ showModal, setShowModal ] = useState(false);
    const [ {rateColor, rateText}, setRateColorText ] = useState({color,text});
    const [ {rateColorHover, rateTextHover}, setRateColorTextHover ] = useState({rateColorHover:null, rateTextHover:null});

    const handleOk = () => {
        setShowModal(false);
    }

    /*const handleRateChange = value => {
        let nameByVal = Object.keys(actionCodes)[value-1];
        if (!nameByVal) 
            return;

        console.log(value, nameByVal, actionCodes[nameByVal]);
        const {color, text} = actionCodes[nameByVal];

        setRateColorText({
            rateColor: color, 
            rateText: text
        });
    }*/

    const handleRateChange = (value, hover) => {
        let nameByVal = Object.keys(actionCodes)[value-1];

        if (hover && !nameByVal) {
            return setRateColorTextHover({
                rateColorHover: null, 
                rateTextHover: null
            });
        }

        if (!nameByVal) nameByVal = 'unset';

        const {color, text} = actionCodes[nameByVal];
        
        if (hover) {
            setRateColorTextHover({
                rateColorHover: color, 
                rateTextHover: text
            });
        } else {
            setRateColorText({
                rateColor: color, 
                rateText: text
            });
        }
    }

    return (
        <Fragment>
            <Button
                style={{color}}
                onClick={ e => setShowModal(true) }
            >
                {text}
            </Button>

            { !showModal ? null :
                <Modal
                    title="Handlungsbedarf festelgen"
                    visible={showModal}
                    onOk={handleOk}
                    onCancel={ e => setShowModal(false) }
                >
                    <p>Legen Sie den Handlungsbedarf und die resultierende Maßnahme hierfür fest.</p>

                    <Rate
                        style={{color:rateColorHover || rateColor, fontSize:36}}
                        defaultValue={3}
                        character={({ index }) => {
                            return customIcons[index + 1];
                        }}
                        onChange={ v => handleRateChange(v, false) }
                        onHoverChange={ v => handleRateChange(v, true) }
                    />
                    <div style={{color:rateColorHover || rateColor}}>{rateTextHover || rateText}</div>
                </Modal>
            }
        </Fragment>
    );
}
