import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, {Fragment, useState} from 'react';
import { Collapse } from 'antd';

import { ModalOpinionDetailNew } from './modals/OpinionDetailNew';
import { OpinionDetails } from '/imports/api/collections/opinionDetails';

const { Panel } = Collapse;

export const ListOpinionDetails = ({refOpinion, refParentDetail}) => {

    const { opinionDetails, isLoading } = useTracker(() => {
        const noDataAvailable = { opinionDetails: [] };

        if (!Meteor.user()) {
            return noDataAvailable;
        }
        const handler = Meteor.subscribe('opinionDetails', {refOpinion, refParentDetail});
    
        if (!handler.ready()) { 
            return { ...noDataAvailable, isLoading: true };
        }
    
        let opinionDetails;
        if (refParentDetail) {
            opinionDetails = OpinionDetails.find({ refParentDetail }).fetch();
        } else {
            opinionDetails = OpinionDetails.find({ refOpinion }).fetch();
        }

        return { opinionDetails, isLoading: false };
    });

    const renderOpinionDetails = () => {
        return opinionDetails.map( detail => {
            return (
                <Panel header={detail.title} key={detail._id}>
                    <div dangerouslySetInnerHTML={ {__html: detail.text}} />

                    <ListOpinionDetails 
                        refOpinion={refOpinion}
                        refParentDetail={detail._id}
                    />

                    <ModalOpinionDetailNew 
                        refOpinion={refOpinion} 
                        refParentDetail={detail._id}
                    />
                </Panel>
            )
        });
    }

    const handleChange = () => {

    }

    return (
        <Fragment>
            <Collapse onChange={handleChange}>
                { renderOpinionDetails() }
            </Collapse>
        </Fragment>
    );
}