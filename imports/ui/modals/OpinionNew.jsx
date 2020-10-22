import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    Button,
    Select,
    Modal
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { useTracker } from 'meteor/react-meteor-data';
import { RolesCollection } from '/imports/api/roles';

const { Option } = Select;

export const ModalOpinionNew = ( props ) => {
    const { roles, isLoadingRoles } = useTracker(() => {
        const noDataAvailable = { roles: [] };

        if (!Meteor.user()) {
          return noDataAvailable;
        }
        const handler = Meteor.subscribe('roles');
    
        if (!handler.ready()) {
          return { ...noDataAvailable, isLoadingRoles: true };
        }
    
        const roles = RolesCollection.find({}).fetch();
        return { roles, isLoadingRoles: false };
    });

    const [ showModalNewOpinion, setShowModalNewOpinion ] = useState(false);

    const handleModalNewOpinionOk = e => {
        Meteor.call('opinion.insert', {
            title: 'Marcs Welthandelsgesellschaft mbH - 3745', 
            description: 'Unser erstes Gutachten per client-Befehl'
        }, (err, res) => {
            console.log('Finish:', err, res);
        });

        setShowModalNewOpinion(false);
    }

    const handleModalNewOpinionCancel = e => {
        setShowModalNewOpinion(false);
    }

    const createNewGutachten = () => {
        setShowModalNewOpinion(true);
    }

    return (
        <Fragment>
            <Button
                type="dashed" block
                icon={<PlusOutlined />}
                onClick={createNewGutachten}>
                    Erstellen eines neuen Gutachten
            </Button>

            { !showModalNewOpinion ? null :
                <Modal
                    title="Neues Gutachten"
                    visible={showModalNewOpinion}
                    onOk={handleModalNewOpinionOk}
                    onCancel={handleModalNewOpinionCancel}
                >
                    <p>Zum Erstellen eines neuen Gutachten füllen Sie bitte die nachfolgenden Felder aus und bestätigen Sie den Dialog mit OK.</p>

                    Rolle:
                    <Select style={{ width: 120 }} loading={isLoadingRoles}>
                        { roles.map (role => <Option key={role._id} value={role._id}>{role.rolename}</Option>) } 
                    </Select>
                </Modal>
            }
        </Fragment>
    );
}
