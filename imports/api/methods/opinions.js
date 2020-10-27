import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions, OpinionsSchema } from '../collections/opinions';
import { hasPermission } from '../helpers/roles';

export const injectUserData = async (userId, data) => {
    check(data, Object);

    console.log('Permitted:', await hasPermission(userId, 'opinion.create'));

    let user = Meteor.users.findOne(userId);
    if (!user) {
        throw new Meteor.Error('User not found!');
    }

    data.createdAt = new Date;
    data.createdBy = {
        userId: userId,
        firstName: user.userData.firstName,
        lastName: user.userData.lastName
    };
    data.sharedWith = [{ 
        user: {
            userId: userId,
            firstName: user.userData.firstName,
            lastName: user.userData.lastName
        }, 
        role: "OWNER"
    }];

    return data;
}

Meteor.methods({
    async 'opinion.insert'(opinionData) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        if (!await hasPermission(this.userId, 'opinion.create')) {
            throw new Meteor.Error('Keine Berechtigung zum Erstellen eines neuen Gutachten.');
        }

        let opinion = await injectUserData(this.userId, {...opinionData});
            
        try {
            OpinionsSchema.validate(opinion);
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
        
        Opinions.insert(opinion);
    }
  });
  