import { Meteor } from 'meteor/meteor';
import { RolesCollection } from '/imports/api/roles';

Meteor.publish('roles', function publishRoles() {
    return RolesCollection.find({});
});