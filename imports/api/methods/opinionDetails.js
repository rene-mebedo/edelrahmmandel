import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '../collections/opinions';
import { OpinionDetails, OpinionDetailSchema } from '../collections/opinionDetails';
import { Activities } from '../collections/activities';

import { hasPermission, injectUserData } from '../helpers/roles';

Meteor.methods({
    /**
     * User-Like or Dislike for opinionDetail by given id
     */
    'opinionDetail.doSocial'(action, id) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        if (action !== 'like' && action !== 'dislike') {
            throw new Meteor.Error('Unknown social command.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);
        const opinionDetail = OpinionDetails.findOne(id);

        const isShared = Opinions.findOne({
            _id: opinionDetail.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!isShared) {
            throw new Meteor.Error('Dieses Detail zum Gutachten wurde nicht mit Ihnen geteilt.');
        }

        // check if we need to push or pop the like
        const doneBefore = OpinionDetails.findOne({            
            _id: id,
            [action + 's.userId']: this.userId
        });

        if (!doneBefore) {
            OpinionDetails.update({_id: id}, {
                $push: {
                    [action + 's']: {
                        userId: this.userId,
                        firstName: currentUser.userData.firstName,
                        lastName: currentUser.userData.lastName
                    }
                }
            });
        } else {
            // unlike
            OpinionDetails.update({_id: id}, {
                $pull: {
                    [action + 's']: {
                        userId: this.userId,
                        firstName: currentUser.userData.firstName,
                        lastName: currentUser.userData.lastName
                    }
                }
            });
        }
    },

    /**
     * Toggels the delete flag of the given opinion detail
     * 
     * @param {String} id Id of the opinionDetail to be toggelt
     */
    'opinionDetail.toggleDeleted'(id) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);
        const opinionDetail = OpinionDetails.findOne(id);

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: opinionDetail.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Dieses Detail zum Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (! hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.remove')) {
            throw new Meteor.Error('Keine Berechtigung zum Löschen dieses Details zum Gutachten.');
        }

        OpinionDetails.update(id, {
            $set:{ deleted: !opinionDetail.deleted },
            $inc: { activitiesCount: 1 }
        });

        let activity = injectUserData({ currentUser }, {
            refOpinion: opinionDetail.refOpinion,
            refDetail: id._str || id,
            type: 'SYSTEM-LOG',
            action: 'REMOVE',
            message: opinionDetail.deleted ? "hat die Löschmarkierung zurückgenommen" : "hat es als gelöscht markiert.",
            changes: [{
                message: opinionDetail.deleted ? "Die Löschmarkierung wurde zurückgenommen" : "Das Detail wurde als gelöscht markiert",
                propName: "deleted",
                oldValue: opinionDetail.deleted,
                newValue: !opinionDetail.deleted
            }]
        }, { created: true });

        Activities.insert(activity);

        /*OpinionDetails.update(id._str || id, {
            $inc: { activitiesCount: 1 }
        });*/
    },
    
    'opinionDetail.insert'(detailData) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);

        if (!/*await*/ hasPermission({ currentUser }, 'opinion.create')) {
            throw new Meteor.Error('Keine Berechtigung zum Erstellen eines neuen Details zu einem Gutachten.');
        }
        
        let detail = /*await*/ injectUserData({ currentUser }, {...detailData}, { created: true });
        
        try {
            OpinionDetailSchema.validate(detail);
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
        
        let newId = OpinionDetails.insert(detail);
        
        let activity = /*await*/ injectUserData({ currentUser }, {
            refOpinion: detail.refOpinion,
            refDetail: newId,
            type: 'SYSTEM-LOG',
            action: 'INSERT',
            message: 'Detail wurde erstellt.'
        }, { created: true });

        Activities.insert(activity);
    },

    /**
     * Aktualisieren eines Gutachtendetails in der Collection
     * 
     * @param {Object} opinionDetail 
     */
    /*async*/ 'opinionDetail.update'(opinionDetail) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);
        const old = OpinionDetails.findOne(opinionDetail.id);

        const shared = Opinions.findOne({
            _id: old.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Dieses Detail zum Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!/*await*/ hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten dieses Details zum Gutachten.');
        }

        // check what has changed
        let changes = [];

        if (opinionDetail.data.orderString && old.orderString !== opinionDetail.data.orderString) {
            changes.push ({
                what: "die Sortierreihenfolge",
                message: "Die Sortierreihenfolge wurde geändert.",
                propName: "orderString",
                oldValue: old.orderString,
                newValue: opinionDetail.data.orderString
            });
        }

        if (opinionDetail.data.type && old.type !== opinionDetail.data.type) {
            changes.push ({
                what: "den Typ",
                message: "Der Typ wurde geändert.",
                propName: "type",
                oldValue: old.type,
                newValue: opinionDetail.data.type
            });
        }
        if (opinionDetail.data.title && old.title !== opinionDetail.data.title) {
            changes.push ({
                what: "den Titel",
                message: "Der Titel wurde geändert.",
                propName: "title",
                oldValue: old.title,
                newValue: opinionDetail.data.title
            });
        }

        if (opinionDetail.data.text && old.text !== opinionDetail.data.text) {
            changes.push ({
                what: "den Text",
                message: "Der Text wurde geändert.",
                propName: "text",
                oldValue: old.text,
                newValue: opinionDetail.data.text
            });
        }

        if (opinionDetail.data.printTitle && old.printTitle !== opinionDetail.data.printTitle) {
            changes.push ({
                what: "den Drucktitel",
                message: "Der Drucktitel wurde geändert.",
                propName: "orderString",
                oldValue: old.printTitle,
                newValue: opinionDetail.data.printTitle
            });
        }

        if (opinionDetail.data.actionCode && old.actionCode !== opinionDetail.data.actionCode) {
            changes.push ({
                what: "den Handlungsbedarf",
                message: "Der Handlungsbedarf wurde geändert.",
                propName: "actionCode",
                oldValue: old.actionCode,
                newValue: opinionDetail.data.actionCode
            });
        }

        if (opinionDetail.data.deleted === false) {
            changes.push ({
                what: "die Löschmarkierung",
                message: "Die Löschmarkierung wurde zurückgesetzt.",
                propName: "deleted",
                oldValue: true,
                newValue: false
            });
        }

        let message = "hat " + changes.map( ({ what }) => what).join(', ') + " geändert.";

        // are there changes to commit
        if (changes.length) {
            OpinionDetails.update(opinionDetail.id, { $set: opinionDetail.data });
            
            let activity = /*await*/ injectUserData({ currentUser }, {
                refOpinion: old.refOpinion,
                refDetail: opinionDetail.id,
                type: 'SYSTEM-LOG',
                action: 'UPDATE',
                message,
                changes
            }, { created: true });
            
            console.log('Insert Activity', this.isSimulation);
            Activities.insert(activity);
            
            return changes;
        }
    },

    'opinionDetail.remove'(id) {
        //check(id, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);
        const old = OpinionDetails.findOne(id);

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: old.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Dieses Detail zum Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!/*await*/ hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.remove')) {
            throw new Meteor.Error('Keine Berechtigung zum Löschen dieses Details zum Gutachten.');
        }

        OpinionDetails.update(id, {
            $set:{ deleted: true }
        });
        /*OpinionDetails.remove(id);
        
        let activity = await injectUserData({ currentUser }, {
            refOpinion: old.refOpinion,
            refDetail: id._str || id,
            type: 'SYSTEM-LOG',
            action: 'REMOVE',
            message: "Das Detail mit dem Titel '" + old.title + "' wurde gelöscht.",
        }, { created: true });*/

        let activity = /*await*/ injectUserData({ currentUser }, {
            refOpinion: old.refOpinion,
            refDetail: id._str || id,
            type: 'SYSTEM-LOG',
            action: 'REMOVE',
            message: "hat es als gelöscht markiert.",
            changes: [{
                message: "Das Detail wurde als gelöscht markiert",
                propName: "deleted",
                oldValue: false,
                newValue: true
            }]
        }, { created: true });

        console.log('Insert Activity', this.isSimulation);
        Activities.insert(activity);
    },

});

if (Meteor.isServer) {
    Meteor.methods({
        'opinionDetail.getBreadcrumbItems'({refOpinion, refDetail}) {
            let items = [
                { title: 'Start', uri: '/' },
                { title: 'Gutachten', uri: '/opinions' },
            ];

            const opinion = Opinions.findOne(refOpinion);
            items.push({
                title: opinion.title,
                uri: `/opinions/${opinion._id}`
            });

            const getRecursive = id => {
                let item = OpinionDetails.findOne(id);
                if (item && item.refParentDetail !== null) {
                    getRecursive(item.refParentDetail);
                    items.push({
                        title: item.title,
                        uri: `/opinions/${item.refOpinion}/${item._id}`
                    });
                }
            }
            getRecursive(refDetail);

            return items;
        }
    });
}