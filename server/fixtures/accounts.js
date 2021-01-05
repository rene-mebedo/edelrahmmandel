import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Setup Admin user if not exists
const USERNAME = 'admin';
const PASSWORD = 'password';  

if (!Accounts.findUserByUsername(USERNAME)) {
    Accounts.createUser({
        username: USERNAME,
        password: PASSWORD,
    });

    let newUser = Accounts.findUserByUsername(USERNAME);
     
    Meteor.users.update( newUser._id, {
        $set: {
            userData: {
                firstName: 'Rene',
                lastName: 'Schulte ter Hardt',
                roles: ['EVERYBODY', 'ADMIN']
            }
        }
    });


    Accounts.createUser({
        username: 'tester',
        password: 'test',
    });

    newUser = Accounts.findUserByUsername('tester');
     
    Meteor.users.update( newUser._id, {
        $set: {
            userData: {
                firstName: 'Alois',
                lastName: 'Mustermann',
                roles: ['EVERYBODY', 'EMPLOYEE']
            }
        }
    });
}

if (!Accounts.findUserByUsername('tester')) {
    
    Accounts.createUser({
        username: 'tester',
        password: 'test',
    });

    newUser = Accounts.findUserByUsername('tester');
     
    Meteor.users.update( newUser._id, {
        $set: {
            userData: {
                firstName: 'Alois',
                lastName: 'Mustermann',
                roles: ['EVERYBODY', 'EMPLOYEE']
            }
        }
    });
}

if (!Accounts.findUserByUsername('readonly')) {
    
    Accounts.createUser({
        username: 'readonly',
        password: 'readonly',
    });

    newUser = Accounts.findUserByUsername('readonly');
     
    Meteor.users.update( newUser._id, {
        $set: {
            userData: {
                firstName: 'Hans',
                lastName: 'Nurlesen',
                roles: ['EVERYBODY']
            }
        }
    });
}