import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    PageHeader, 
    Breadcrumb,
    Button,
    Select,
    Modal
} from 'antd';

import { useTracker } from 'meteor/react-meteor-data';
import { RolesCollection } from '/imports/api/roles';

const { Option } = Select;

export const ModalOpinionNew = ( { show } ) => {
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
        setShowModalNewOpinion(false);
    }

    const handleModalNewOpinionCancel = e => {
        setShowModalNewOpinion(false);
    }

    const createNewGutachten = () => {
        setShowModalNewOpinion(true);
    }

    return ( !show ? null :
        <Modal
            title="Neues Gutachten"
            visible={show || showModalNewOpinion}
            onOk={handleModalNewOpinionOk}
            onCancel={handleModalNewOpinionOk}
        >
            <p>Zum Erstellen eines neuen Gutachten füllen Sie bitte die nachfolgenden Felder aus und bestätigen Sie den Dialog mit OK.</p>

            Rolle:
            <Select style={{ width: 120 }} loading={isLoadingRoles}>
                { roles.map (role => <Option key={role._id} value={role._id}>{role.rolename}</Option>) } 
            </Select>
        </Modal>
    );
}
