import React, { 
    Fragment,
    useEffect
} from 'react';

import { useTracker } from 'meteor/react-meteor-data';

import { Spin } from 'antd';

import { LoginForm } from '/imports/ui/LoginForm';
import { SiteLayout } from '/imports/ui/SiteLayout';
import { Roles } from '/imports/api/collections/roles';

export const App = ({content, refOpinion, refDetail}) => {
    const { currentUser, isLoading } = useTracker(() => {
        const noDataAvailable = { currentUser: null };

        if (!Meteor.user()) {
            return noDataAvailable;
        }
        const hCurrentUser = Meteor.subscribe('currentUser');
        const hRoles = Meteor.subscribe('roles');
    
        if (!hCurrentUser.ready() || !hRoles.ready()) { 
            return { ...noDataAvailable, isLoading: true };
        }
        
        const currentUser = Meteor.users.findOne({_id:Meteor.userId()});
        
        return { currentUser, isLoading: false };
    });

    useEffect(() => {
        const reactRoot = document.getElementById('react-root');
        
        // add done for the initial loading
        reactRoot.classList.add('done');
    });

    if (currentUser === undefined) {
        return <Spin size="large" />
    }

    if (!currentUser) {
        return <LoginForm />
    }

    return (
        <SiteLayout 
            refOpinion={refOpinion}
            refDetail={refDetail}
            currentUser={currentUser}
        >
            {
                //content || null
                React.createElement(content || null, {refOpinion, refDetail, currentUser})
            }
        </SiteLayout>
    );
}   