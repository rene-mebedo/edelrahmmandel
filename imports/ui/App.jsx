import React, { 
  Fragment 
} from 'react';

import { Spin } from 'antd';
import { useTracker } from 'meteor/react-meteor-data';

import { LoginForm } from './LoginForm';
import SiteLayout from './SiteLayout';


export const App = () => {
  const currentUser = useTracker(() => Meteor.user());

  return (
      <Fragment> { 
        currentUser !== undefined ? 
          currentUser !== null ? (
            <SiteLayout />
          ) : (
            <LoginForm />
        ) : (
          <Spin size="large" />
        )
      }
      </Fragment>
  );
}

