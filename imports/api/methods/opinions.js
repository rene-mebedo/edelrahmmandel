import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions, OpinionsSchema } from '../collections/opinions';
import { ParticipantSchema } from '../sharedSchemas/participant';

import { Activities } from '../collections/activities';

import { hasPermission, injectUserData } from '../helpers/roles';

Meteor.methods({
    async 'opinion.insert'(opinionData) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);

        if (!await hasPermission({ currentUser }, 'opinion.create')) {
            throw new Meteor.Error('Keine Berechtigung zum Erstellen eines neuen Gutachten.');
        }

        let opinion = await injectUserData({ currentUser }, {...opinionData});
            
        try {
            OpinionsSchema.validate(opinion);
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
        
        let newOpinionId = Opinions.insert(opinion);
        
        let activity = await injectUserData({ currentUser }, {
            refOpinion: newOpinionId,
            type: 'SYSTEM-LOG',
            message: 'Gutachten wurde erstellt.'
        }, { created: true });

        Activities.insert(activity);
    },

    'opinion.getSharedWith'(refOpinion, searchText) {
        check(refOpinion, String);

        if (searchText) check(searchText, String);

        const opinion = Opinions.findOne(refOpinion);

        return opinion && opinion.sharedWith.map( shared => {
            return shared.user;
        });
    },

    /**
     * Adds a new participant to the existing opinion
     * 
     * @param {String} refOpinion Reference to the Opinion the new participant belongs to
     * @param {Object} participant Data of the participant to creat/add
     */
    'opinion.addParticipant'(refOpinion, participant) {
        check(refOpinion, String);
        check(participant, Object);

        let currentUser = Meteor.users.findOne(this.userId);

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Das angegebene Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten der Teilnehmer eines Gutachten.');
        }

        participant.id = new Meteor.Collection.ObjectID().toHexString();

        try {
            ParticipantSchema.validate(participant);

            Opinions.update(refOpinion, {
                $push: {
                    participants: participant
                }
            });

            const { gender, lastName } = participant;
            const changes = [{
                message: "Der Teilnehmer wurde hinzugefügt",
                propName: "participants",
                oldValue: null,
                newValue: participant
            }];
            let activity = injectUserData({ currentUser }, {
                refOpinion: refOpinion,
                type: 'SYSTEM-LOG',
                action: 'INSERT',
                message: `hat den Teilnehmer ${gender} ${lastName} hinzugefügt.`,
                changes
            }, { created: true });
    
            Activities.insert(activity);

            return changes;
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
    },

    /**
     * Update the given participant by refOption an the id itself
     * 
     * @param {String} refOpinion Reference to the Opinion the participant belongs to
     * @param {Object} participant Data of the participant to update including the id of the participant
     */
    'opinion.updateParticipant'(refOpinion, participant) {
        check(refOpinion, String);
        check(participant, Object);

        let currentUser = Meteor.users.findOne(this.userId);

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Das angegebene Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Editieren der Teilnehmer eines Gutachten.');
        }

        const oldParticipant = shared.participants.find( p => p.id == participant.id );

        try {
            ParticipantSchema.validate(participant);

            Opinions.update({
                _id: refOpinion, 
                'participants.id': participant.id
            },{
                $set: {
                    'participants.$': participant
                }
            });

            const { gender, lastName } = participant;
            const changes = [{
                message: "Die Teilnehmerdaten wurden geändert",
                propName: "participants",
                oldValue: oldParticipant,
                newValue: participant
            }];
            let activity = injectUserData({ currentUser }, {
                refOpinion: refOpinion,
                type: 'SYSTEM-LOG',
                action: 'UPDATE',
                message: `hat den Teilnehmer ${gender} ${lastName} geändert.`,
                changes
            }, { created: true });
    
            Activities.insert(activity);

            return changes;
        } catch (err) {
            throw new Meteor.Error(err.message);
        } 
    },

    /**
     * Remove the given participant by refOption an the id itself
     * 
     * @param {String} refOpinion Reference to the Opinion the participant belongs to
     * @param {Object} participant Data of the participant to remove including the id of the participant
     */
    'opinion.removeParticipant'(refOpinion, participant) {
        check(refOpinion, String);
        check(participant && participant.id, String);

        let currentUser = Meteor.users.findOne(this.userId);

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Das angegebene Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Löschen des Teilnehmers eines Gutachten.');
        }

        try {
            Opinions.update({
                _id: refOpinion
            },{
                $pull: {
                    'participants': participant
                }
            });

            const { gender, lastName } = participant;
            const changes = [{
                message: "Der Teilnehmer wurde gelöscht",
                propName: "participants",
                oldValue: participant,
                newValue: null
            }];
            let activity = injectUserData({ currentUser }, {
                refOpinion: refOpinion,
                type: 'SYSTEM-LOG',
                action: 'REMOVE',
                message: `hat den Teilnehmer ${gender} ${lastName} gelöscht.`,
                changes
            }, { created: true });
    
            Activities.insert(activity);

            return changes;
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
    }
});