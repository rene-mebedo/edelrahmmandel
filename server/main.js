import { Meteor } from 'meteor/meteor';

import './fixtures';
import './publications';
import './methods'; 
import '../imports/api/methods';

import './datatransfer';

import { Accounts } from 'meteor/accounts-base'

Accounts.validateLoginAttempt( loginData => {
    const { allowed, methodName } = loginData;

    if (methodName == 'verifyEmail') {
        return allowed;
    }

    if (methodName == 'login') {
        if (loginData.methodArguments[0].resume && allowed) return true;

        const { email, username, resume } = loginData.methodArguments[0].user;
        
        // check if we got a user like "admin" that signed in without email
        if (username && !email && allowed) {
            return true;
        }

        const verifiedUser = Meteor.users.findOne({
            'emails.address': email,
            'emails.verified': true
        });

        return !!verifiedUser;
    }

    throw new Meteor.Error('Unknown Loginattempt rejected.');
});

Meteor.startup(() => {
    console.log('Running in ' + process.env.NODE_ENV + ' mode.');
});
