import { Meteor } from 'meteor/meteor';
import { Roles } from '../collections/roles';

export const hasPermission = async (userId, permissionPath) => {
    let user = Meteor.users.findOne(userId);

    if (!user) {
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
                    isPermitted: { $sum: "$permissions." + permissionPath }
                }
            }
        ]).toArray()
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