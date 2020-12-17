import React, { 
    Fragment,
    useEffect
} from 'react';

import { useTracker } from 'meteor/react-meteor-data';

import { Spin } from 'antd';

import { LoginForm } from '/imports/ui/LoginForm';
import { SiteLayout } from '/imports/ui/SiteLayout';
import { Roles } from '/imports/api/collections/roles';
import { useAccount, useRoles } from '../client/trackers';

export const App = ({content, refOpinion, refDetail, activeMenuKey}) => {
    const { currentUser, isLoggedIn, accountsReady } = useAccount();
    const { roles, rolesLoading } = useRoles();

    useEffect(() => {
        const reactRoot = document.getElementById('react-root');
        
        // add done for the initial loading
        reactRoot.classList.add('done');
    });

    if (!accountsReady) {
        return <Spin size="large" />
    }

    if (!isLoggedIn) {
        return <LoginForm />
    }

    return (
        <SiteLayout 
            activeMenuKey={activeMenuKey}
            refOpinion={refOpinion}
            refDetail={refDetail}
            currentUser={currentUser}
        >
            {
                //content || null
                React.createElement(content || null, { refOpinion, refDetail, currentUser })
            }
        </SiteLayout>
    );
}   