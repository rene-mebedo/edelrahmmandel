import { Meteor } from 'meteor/meteor';
import { Opinions } from '/imports/api/collections/opinions';

Meteor.publish('opinions', function publishOpinions() {
    //Meteor._sleepForMs(2000);
    return Opinions.find({
        "sharedWith.user.userId": this.userId
    });
});