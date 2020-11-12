import React, { 
  Fragment 
} from 'react';

import { useTracker } from 'meteor/react-meteor-data';

import { Spin } from 'antd';

import { LoginForm } from '/imports/ui/LoginForm';
import { SiteLayout } from '/imports/ui/SiteLayout';


export const App = ({content, refOpinion, refDetail}) => {
  const currentUser = useTracker(() => Meteor.user());

  if (currentUser === undefined) {
    return <Spin size="large" />
  }

  if (currentUser === null) {
    return <LoginForm />
  }

  return <SiteLayout refOpinion={refOpinion} refDetail={refDetail}>{content || null}</SiteLayout>;
}