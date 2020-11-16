import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Roles } from '../collections/roles';

/**
 * Check if Role is permitted by the given permission or not.
 * 
 * @param {String} permissionName eg "opinion.create" or "shareWith"
 * @param {*} roleObj Role-Object to check if permitted or not
 * 
 * @returns {Boolean} If the role is permitted true otherwise false
 */
const isRolePermitted = (permissionName, roleObj) => {
    let isPermitted = 0;
    if (permissionName.startsWith('opinion.')) {
        const n = permissionName.split('.')[1];
        isPermitted = roleObj.permissions.opinion[n];
    } else {
        isPermitted = roleObj.permissions[permissionName];
    }
    return isPermitted == 1;
}


/**
 * Check if the given user is permitted to a permission by Name or not
 * 
 * @param {Object} param0 { userId: String, currentUser: Object, sharedRole: String }
 *                              Defines the user in the best way
 *                              If the userObject is present just pass currentUser and we dont need to read the
 *                              data of the currentUser a second time. If not available pass userId.
 *                              If the user has a role assignment by sharing the object so pass this rolename as String
 *                              to inspect if the user is permitted or not.
 * 
 * @param {*} permissionName    Name of the permission eg "opinion.create" or "shareWith"
 * 
 * @return {Boolean} True if user is permitted otherwise false
 */
export const hasPermission = /*async*/ ({ userId, currentUser, sharedRole }, permissionName) => {
    if (!currentUser) currentUser = Meteor.users.findOne(userId);

    if (!currentUser) {
        throw new Meteor.Error('hasPermission: User not found!');
    }

    // first getting the roles the user has assigned to
    assignedRoles = Roles.find({ _id: { $in: sharedRole ? [sharedRole] : currentUser.userData.roles }}).fetch();
    
    let isPermitted = 0;
    assignedRoles.map( role => {
        if (isRolePermitted(permissionName, role)) isPermitted++;
    });

    return isPermitted > 0;
}


export const injectUserData = /*async*/ ({ userId, currentUser }, data, options) => {
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