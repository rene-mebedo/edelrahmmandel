import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Opinions } from '/imports/api/collections/opinions';

Meteor.publish('opinions', function publishOpinions(id) {
    if (!id) return Opinions.find({
        "sharedWith.user.userId": this.userId
    });

    check (id, String);
    
    return Opinions.find({
        _id: id,
        "sharedWith.user.userId": this.userId
    });
});