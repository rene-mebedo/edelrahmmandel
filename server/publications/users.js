import { Meteor } from 'meteor/meteor';

Meteor.publish('currentUser', function publishCurrentUser() {
    // extra publish with the field of userdata: { ... }
    // by default meteor only publishs id and username
    return Meteor.users.find({ _id: this.userId });
});