import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import { App } from '/imports/ui/App';


import { Home } from '../imports/ui/Home';
import { ActivitiesForm } from '../imports/ui/ActivitiesForm';
import { OpinionsForm } from '../imports/ui/OpinionsForm';
import { OpinionsDetailsForm } from '../imports/ui/OpinionsDetailsForm';
import { OpinionsDetailsFormLinkable } from '../imports/ui/OpinionsDetailsFormLinkable';

FlowRouter.route('/', {
    name: 'root',
    action() {
        mount(App, {
            content: Home,
        });
    },
});

FlowRouter.route('/activities', {
    name: 'activities.show',
    action() {
        mount(App, {
            content: ActivitiesForm,
        });
    },
});

FlowRouter.route('/opinions', {
    name: 'opinions.show',
    action() {
        mount(App, {
            content: OpinionsForm,
        });
    },
});

FlowRouter.route('/opinions/:id', {
    name: 'opinion.detail',
    action({ id }) {
        mount(App, {
            content: OpinionsDetailsForm,
            refOpinion: id
        });
    },
});

FlowRouter.route('/opinions/:id/:refDetail', {
    name: 'opinion.detail.show',
    action({ id, refDetail }) {
        mount(App, {
            content: OpinionsDetailsFormLinkable,
            //content: <OpinionsDetailsFormLinkable refOpinion={id} refDetail={refDetail} />,
            refOpinion: id,
            refDetail: refDetail
        });
    },
});