import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '../collections/opinions';
import { OpinionDetails, OpinionDetailSchema } from '../collections/opinionDetails';
import { Activities, ActivitySchema, AnswerSchema } from '../collections/activities';

import { hasPermission, injectUserData } from '../helpers/roles';

Meteor.methods({
    /**
     * User-Like or Dislike for opinionDetail by given id
     */
    'activities.doSocial'(action, id) {
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
     * Creates a new Activity as user post
     * 
     * @param {String} msg Message that the user posts
     */
    'activities.postmessage'(refDetail, msg) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        const currentUser = Meteor.users.findOne(this.userId);
        
        const detail = OpinionDetails.findOne(refDetail);

        // check if opinion was sharedWith the current User
        const sharedOpinion = Opinions.findOne({
            _id: detail.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!sharedOpinion) {
            throw new Meteor.Error('Dieses Gutachten wurde nicht mit Ihnen geteilt. Sie können keinen Kommentar verfassen.');
        }

        const sharedWithRole = sharedOpinion.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.canPostMessage')) {
            throw new Meteor.Error('Keine Berechtigung zum Erstellen eines Kommentars zu einem Gutachten.');
        }
        
        let activity = injectUserData({ currentUser }, {
            refOpinion: sharedOpinion._id,
            refDetail: detail._id,
            type: 'USER-POST',
            message: msg
        }, { created: true }); 

        try {
            ActivitySchema.validate(activity);
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
        
        Activities.insert(activity);
        
        OpinionDetails.update(activity.refDetail, {
            $inc: { commentsCount: 1 }
        });
    },

    /**
     * Creates an answer to an existing Activity
     * 
     * @param {String} refOpinion Id of the Opinion where the Activity belongs to
     * @param {String} refActivity Id of the Activity where the message is the answer for
     * @param {Object} msg (mentions, text) Message that the user posts
     */
    'activities.replyTo'(refOpinion, refActivity, msg) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        console.log(refOpinion, refActivity, msg);
        
        const currentUser = Meteor.users.findOne(this.userId);
        
        const activity = Activities.findOne(refActivity);
        const opinionDetail = OpinionDetails.findOne(activity.refDetail);

        // check if opinion was sharedWith the current User
        const sharedOpinion = Opinions.findOne({
            _id: refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!sharedOpinion) {
            throw new Meteor.Error('Dieses Gutachten/Aktivität wurde nicht mit Ihnen geteilt. Sie können keine Antwort verfassen.');
        }

        const sharedWithRole = sharedOpinion.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.canPostMessage')) {
            throw new Meteor.Error('Keine Berechtigung zum Erstellen eines Kommentars zu einem Gutachten.');
        }
        
        const answer = injectUserData({ currentUser }, {
            message: msg.text
        }, { created: true });

        try {
            AnswerSchema.validate(answer);
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
        
        Activities.update(refActivity, {
            $push: {
                answers: answer
            }
        });
        
        OpinionDetails.update(opinionDetail._id, {
            $inc: { commentsCount: 1 }
        });
    },

});