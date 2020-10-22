import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import { App } from '/imports/ui/App';


import { Home } from '../imports/ui/Home';
import { ActivitiesForm } from '../imports/ui/ActivitiesForm';
import { OpinionsForm } from '../imports/ui/OpinionsForm';

FlowRouter.route('/', {
    name: 'root',
    action() {
        mount(App, {
            content: <Home />,
        });
    },
});

FlowRouter.route('/activities', {
    name: 'activities.show',
    action() {
        mount(App, {
            content: <ActivitiesForm />,
        });
    },
});

FlowRouter.route('/opinions', {
    name: 'opinions.show',
    action() {
        mount(App, {
            content: <OpinionsForm />,
        });
    },
});

FlowRouter.route('/opinions/:id', {
    name: 'opinion.detail',
    action({ id }) {
        mount(App, {
            content: <div>{id}</div>,
        });
    },
});