import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '../../imports/api/collections/opinions';

import { hasPermission } from '../../imports/api/helpers/roles';
import { escapeRegExp } from '../../imports/api/helpers/basics';


Meteor.methods({
    'users.getExperts'(refOpinion, searchText){
        check(refOpinion, String);
        check(searchText, String);

        let currentUser = Meteor.users.findOne(this.userId);

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Das angegebene Gutachten wurde nicht mit Ihnen geteilt. Sie können keinen Gutachter auswählen.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten des Gutachtens. Sie können keinen Gutachter auswählen.');
        }

        
        const opinionOwners = Opinions.findOne({
            _id: refOpinion
        }).sharedWith.filter( item => {
            return item.role === 'OWNER';
        }).map( item => item.user.userId );

        const escapedText = escapeRegExp(searchText);

        /* Wer kann alles Gutachter sein?
            - Der Owner des Gutachtens
            - Jeder Mitarbeiter von MEBEDO -> Rolle EMPLOYEE
            - Und ggf. der Admin -> Rolle ADMIN
        */
        const users =  Meteor.users.find({
            $and: [
                {'userData.roles': { $in: ['EMPLOYEE', 'ADMIN', 'OWNER'] }},
                { 
                    $or: [
                        { 'username': { $regex : escapedText, $options:"i" } },
                        { 'userData.firstName': { $regex : escapedText, $options:"i" } },
                        { 'userData.lastName': { $regex : escapedText, $options:"i" } },
                        { _id: { $in: opinionOwners } }
                    ]
                }
            ]
        }, { fields: { 'userData.roles': 0 }, limit: 10 }).fetch().map( user => {
            const { _id, username, userData } = user;

            return { userId: _id, username, ...userData};
        });
        
        return users;
    },

    'users.getAll'(refOpinion, searchText){
        check(refOpinion, String);
        check(searchText, String);

        const escapedText = escapeRegExp(searchText);

        const users =  Meteor.users.find({
            $or: [
                { 'username': { $regex : escapedText, $options:"i" } },
                { 'userData.firstName': { $regex : escapedText, $options:"i" } },
                { 'userData.lastName': { $regex : escapedText, $options:"i" } }
            ]
        }, { fields: { 'userData.roles': 0 }, limit: 10 }).fetch().map( user => {
            const { _id, username, userData } = user;

            return { userId: _id, username, ...userData};
        });
        
        return users;
    }
});