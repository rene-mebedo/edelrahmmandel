import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Roles } from '../collections/roles';

export const hasPermission = async ({ userId, currentUser }, permission) => {
    if (!currentUser) currentUser = Meteor.users.findOne(userId);

    if (!currentUser) {
        throw new Meteor.Error('hasPermission: User not found!');
    }

    let permitted;
    if (Meteor.isServer) {
        permitted = await Roles.rawCollection().aggregate([
            { 
                $match: { _id: { $in:["EMPLOYEE", "EVERYBODY", "EXTERNAL", "ADMIN"] }}
            },
            {
                $group: {
                    _id: 0,
                    isPermitted: { $sum: "$permissions." + permission }
                }
            }
        ]).toArray();
        permitted = permitted[0];
    } else {
        // cant use rawCollection on client side
        // so the client will always trust and is permitted by default
        // every client-action should be surpressed by the ui if the user
        // is not permitted
        permitted = { isPermitted: 1 };
    }

    return (
        permitted.isPermitted > 0
    );
}


export const injectUserData = async ({ userId, currentUser }, data, options) => {
    check(data, Object);
    
    if (!currentUser) currentUser = Meteor.users.findOne(userId);
    
    if (!currentUser) {
        throw new Meteor.Error('User not found!');
    }

    if (!options || options.created){
        data.createdAt = new Date;
        data.createdBy = {
            userId: currentUser._id,
            firstName: currentUser.userData.firstName,
            lastName: currentUser.userData.lastName
        };
    }

    if (!options || options.sharedWith) {
        data.sharedWith = [{ 
            user: {
                userId: currentUser._id,
                firstName: currentUser.userData.firstName,
                lastName: currentUser.userData.lastName
            }, 
            role: "OWNER"
        }];
    }

    return data;
}