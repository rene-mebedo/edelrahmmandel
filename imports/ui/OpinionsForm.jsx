import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    PageHeader, 
    Breadcrumb,
    Button,
    Select,
    Modal
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { ModalOpinionNew } from './modals/OpinionNew';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { useTracker } from 'meteor/react-meteor-data';
import { RolesCollection } from '/imports/api/roles';

const { Option } = Select;

export const OpinionsForm = () => {
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
/*
    const handleModalNewOpinionOk = e => {
        setShowModalNewOpinion(false);
    }

    const handleModalNewOpinionCancel = e => {
        setShowModalNewOpinion(false);
    }*/

    const createNewGutachten = () => {
        setShowModalNewOpinion(true);
    }

    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Start</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">Gutachten</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                className="site-page-header"
                title="Gutachten"
                subTitle="Übersicht der Ihnen zugewiesenen oder von Ihnen erstellten Gutachten."
            />

            <Button
                type="dashed" block
                icon={<PlusOutlined />}
                onClick={createNewGutachten}>
                    Erstellen eines neuen Gutachten
            </Button>

            <ModalOpinionNew show={showModalNewOpinion} />
        </Fragment>
    );
}

/*
{ showModalNewOpinion ? 
    <Modal
        title="Neues Gutachten"
        visible={showModalNewOpinion}
        onOk={handleModalNewOpinionOk}
        onCancel={handleModalNewOpinionOk}
    >
        <p>Zum Erstellen eines neuen Gutachten füllen Sie bitte die nachfolgenden Felder aus und bestätigen Sie den Dialog mit OK.</p>

        Rolle:
        <Select style={{ width: 120 }} loading={isLoadingRoles}>
            { roles.map (role => <Option key={role._id} value={role._id}>{role.rolename}</Option>) } 
        </Select>
    </Modal>
: null }

*/
