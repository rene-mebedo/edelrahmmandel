import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { 
  BrowserRouter as Router,
  Routes 
} from 'react-router-dom';

import { App } from '/imports/ui/App';

Meteor.startup(() => {
  render(
    <Router>
      <App/>
    </Router>, document.getElementById('react-target')
  );
});
