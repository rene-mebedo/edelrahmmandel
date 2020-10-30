import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '../collections/opinions';
import { OpinionDetails, OpinionDetailSchema } from '../collections/opinionDetails';
import { Activities } from '../collections/activities';

import { hasPermission, injectUserData } from '../helpers/roles';

Meteor.methods({
    async 'opinionDetail.insert'(detailData) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);

        if (!await hasPermission({ currentUser }, 'opinion.create')) {
            throw new Meteor.Error('Keine Berechtigung zum Erstellen eines neuen Details zu einem Gutachten.');
        }
        
        let detail = await injectUserData({ currentUser }, {...detailData}, { created: true });
        
        try {
            OpinionDetailSchema.validate(detail);
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
        
        let newId = OpinionDetails.insert(detail);
        
        let activity = await injectUserData({ currentUser }, {
            refOpinion: detail.refOpinion,
            refDetail: newId,
            type: 'SYSTEM-LOG',
            message: 'Detail wurde erstellt.'
        }, { created: true });

        Activities.insert(activity);
    },

    async 'opinionDetail.update'(opinionDetail) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);
        const old = OpinionDetails.findOne(opinionDetail.id);

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: old.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Dieses Detail zum Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!await hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten dieses Details zum Gutachten.');
        }

        OpinionDetails.update(opinionDetail.id, { $set: opinionDetail.data });
        
        let activity = await injectUserData({ currentUser }, {
            refOpinion: old.refOpinion,
            refDetail: opinionDetail.id,
            type: 'SYSTEM-LOG',
            message: 'Detail wurde geändert.',
        }, { created: true });
        
        Activities.insert(activity);
    },

    async 'opinionDetail.remove'(id) {
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
        
        if (!await hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.remove')) {
            throw new Meteor.Error('Keine Berechtigung zum Löschen dieses Details zum Gutachten.');
        }

        OpinionDetails.remove(id);
        
        let activity = await injectUserData({ currentUser }, {
            refOpinion: old.refOpinion,
            refDetail: id._str || id,
            type: 'SYSTEM-LOG',
            message: 'Detail wurde gelöscht.',
        }, { created: true });
        
        Activities.insert(activity);
    }
});
