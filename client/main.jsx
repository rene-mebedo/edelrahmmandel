import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { 
  Router
} from 'react-router';

import { createBrowserHistory } from 'history'

/*import createBrowserHistory from 'history/createBrowserHistory';*/
const browserHistory = createBrowserHistory();

import { App } from '/imports/ui/App';

Meteor.startup(() => {
  render(
    <Router history={browserHistory}>
      <App/>
    </Router>
    , document.getElementById('react-target')
  );
});
