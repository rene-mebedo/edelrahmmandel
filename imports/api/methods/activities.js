import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '../collections/opinions';
import { OpinionDetails, OpinionDetailSchema } from '../collections/opinionDetails';
import { Activities, ActivitySchema, AnswerSchema } from '../collections/activities';

import { hasPermission, injectUserData } from '../helpers/roles';
import { UserActivities, UserActivitySchema } from '../collections/userActivities';


/**
 * 
 */
const messageWithMentions = ({currentUser, msg, refs}) => {
    let { text, mentions } = msg;

    let message = text.replace(/\n/g, '<br>');

    // check mentions
    if (mentions) {
        Object.keys(mentions).forEach( userId => {
            const username = mentions[userId];
            const userMentionRegExp = new RegExp('@' + username, 'g');

            if (message.indexOf('@' + username) > -1) {
                message = message.replace(userMentionRegExp, `<span class="mbac-user-mention" user-id="${userId}">${username}</span>`);

                const useractivity = injectUserData({ currentUser }, { 
                    refUser: userId,
                    type: 'MENTIONED',
                    message: `${currentUser.userData.firstName} ${currentUser.userData.lastName} hat Sie erwähnt.`,
                    originalContent: message,
                    refs/*: {
                        refOpinion: sharedOpinion._id,
                        refOpinionDetail: detail._id,
                        refActivity: null
                    }*/,
                    unread: true
                }, { created: true });

                try {
                    UserActivitySchema.validate(useractivity);
                } catch (err) {
                    throw new Meteor.Error(err.message);
                }
                
                UserActivities.insert(useractivity);
            }
        });
    }

    return message;
}


Meteor.methods({
    /**
     * User-Like or Dislike for opinionDetail by given id
     */
    'activities.doSocial'(action, id) {
        this.unblock();

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
    'activities.postmessage'(refOpinion, refDetail, msg) {
        this.unblock();

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        const currentUser = Meteor.users.findOne(this.userId);
        
        const detail = OpinionDetails.findOne(refDetail);

        // check if opinion was sharedWith the current User
        const sharedOpinion = Opinions.findOne({
            _id: (detail && detail.refOpinion) || refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!sharedOpinion) {
            throw new Meteor.Error('Dieses Gutachten wurde nicht mit Ihnen geteilt. Sie können keinen Kommentar verfassen.');
        }

        const sharedWithRole = sharedOpinion.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.canPostMessage')) {
            throw new Meteor.Error('Keine Berechtigung zum Erstellen eines Kommentars zu einem Gutachten.');
        }
        
        const message = messageWithMentions({ currentUser, msg, refs: {
            refOpinion: sharedOpinion._id,
            refOpinionDetail: (detail && detail._id) || null,
            refActivity: null
        }});
        
        let activity = injectUserData({ currentUser }, {
            refOpinion: sharedOpinion._id,
            refDetail: (detail && detail._id) || null,
            type: 'USER-POST',
            message
        }, { created: true }); 

        try {
            ActivitySchema.validate(activity);
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
        
        Activities.insert(activity);
        
        if (activity.refDetail) {
            OpinionDetails.update(activity.refDetail, {
                $inc: { commentsCount: 1 }
            });
        }
    },

    /**
     * Creates an answer to an existing Activity
     * 
     * @param {String} refOpinion Id of the Opinion where the Activity belongs to
     * @param {String} refActivity Id of the Activity where the message is the answer for
     * @param {Object} msg (mentions, text) Message that the user posts
     */
    'activities.replyTo'(refOpinion, refActivity, msg) {
        this.unblock();

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const currentUser = Meteor.users.findOne(this.userId);
        
        const activity = Activities.findOne(refActivity);
        const opinionDetail = OpinionDetails.findOne(activity.refDetail);

        const message = messageWithMentions({ currentUser, msg, refs: {
            refOpinion: refOpinion,
            refOpinionDetail: opinionDetail && opinionDetail._id || null,
            refActivity: refActivity
        }});

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
        
        const answer = injectUserData({ currentUser }, { message }, { created: true });

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

        // tell the autor of the post that someone has answered to his post
        UserActivities.insert(
            injectUserData({ currentUser }, {
                refUser: activity.createdBy.userId,
                type: 'REPLYTO',
                refs: { 
                    refOpinion, 
                    refActivity,
                    refOpinionDetail: opinionDetail && opinionDetail._id || null,
                },
                message: `${currentUser.userData.firstName} ${currentUser.userData.lastName} hat auf einen Post von Ihnen geantwortet.`,
                originalContent: message,
                unread: true
            }, { created: true })        
        );

        if (opinionDetail) {
            OpinionDetails.update(opinionDetail._id, {
                $inc: { commentsCount: 1 }
            });
        }
    },

});