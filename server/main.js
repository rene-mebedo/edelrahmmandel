import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { RolesCollection } from '/imports/api/roles';

import '/imports/api/publications/roles';
import '/imports/api/publications/opinions';

Meteor.startup(() => {
    const SEED_USERNAME = 'admin';
    const SEED_PASSWORD = 'password';  
    
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  if (RolesCollection.find().count() != 3) {
    RolesCollection.remove({});

    RolesCollection.insert({
      _id: 'EVERYBODY',
      rolename: 'Jeder',
      score: 0,
      description: 'Zugriff für jeden Benutzer'
     });

     RolesCollection.insert({
      _id: 'EXTERNAL',
      rolename: 'Externer',
      score: 100,
      description: 'Zugriff nur für externe - Kunden, Projektleiter, etc.'
     });

     RolesCollection.insert({
      _id: 'EMPLOYEE',
      rolename: 'Mitarbeiter',
      score: 200,
      description: 'Zugriff nur für Mitarbeiter'
     });
  
     RolesCollection.insert({
      _id: 'ADMIN',
      rolename: 'Administrator',
      score: 99999,
      description: 'Admin darf alles'
     });
  }
});
