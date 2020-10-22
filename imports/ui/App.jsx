import React, { 
  Fragment 
} from 'react';

import { useTracker } from 'meteor/react-meteor-data';

import { Spin } from 'antd';

import { LoginForm } from '/imports/ui/LoginForm';
import { SiteLayout } from '/imports/ui/SiteLayout';


export const App = props => {
  const currentUser = useTracker(() => Meteor.user());

  if (currentUser === undefined) {
    return <Spin size="large" />
  }

  if (currentUser === null) {
    return <LoginForm />
  }

  return <SiteLayout>{props.content || null}</SiteLayout>;
}