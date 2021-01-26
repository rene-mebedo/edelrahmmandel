import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '../collections/opinions';
import { OpinionDetails, OpinionDetailSchema } from '../collections/opinionDetails';
import { Activities } from '../collections/activities';

import { hasPermission, injectUserData } from '../helpers/roles';
import { determineChanges } from '../helpers/activities';

import { actionCodes } from '../constData/actioncodes';
//import { data } from 'jquery';

import { renderTemplate } from '../constData/layouttypes';

Meteor.methods({
    /**
     * User-Like or Dislike for opinionDetail by given id
     */
    'opinionDetail.doSocial'(action, id) {
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
    },
    
    /**
     * Takes the given OpinionDetail (Answer) and set the actionCode and -text
     * to it's parent. At the same time all other answers at the same level will
     * be marked as deleted. This will save tons of click's and time for the user!
     * 
     * @param {String} refDetail Specifies the OpinionDetail
     */
    'opinionDetail.checkAnswer'(refDetail) {
        check(refDetail, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);
        const opinionDetail = OpinionDetails.findOne(refDetail);

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: opinionDetail.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Dieses Detail zum Gutachten wurde nicht mit Ihnen geteilt und Sie können daher die Antwort nicht als "richtig" einsetzen.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (! hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.remove')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten dieses Details zum Gutachten und Sie können daher die Antwort nicht als "richtig" einsetzen.');
        }

        // check if we have an Answer
        if (opinionDetail.type !== 'ANSWER') {
            throw new Meteor.Error('Sie können die Aktion "Check" nur mit Details vom Typ "Antwort" durchführen.');
        }

        // save the old parent opinionDetail for the log
        oldParentDetail = OpinionDetails.findOne(opinionDetail.refParentDetail);

        if (!oldParentDetail) {
            throw new Meteor.Error('Der Vorgang CheckAnswer wird abgebrochen. Es konnte das Parent-Element zu diesem Detail nicht gefunde werden. Bitte wenden Sie sich  an Ihren Systemadministrator.');
        }

        // update the parent
        OpinionDetails.update( { _id: opinionDetail.refParentDetail }, {
            $set: {
                actionCode: opinionDetail.actionCode,
                actionText: opinionDetail.actionText,
                actionPrio: opinionDetail.actionPrio
            }
        });

        // update all siblings from type answer
        OpinionDetails.update( { 
            _id: { $ne: opinionDetail._id },
            refParentDetail: opinionDetail.refParentDetail,
            type: 'ANSWER'
        }, {
            $set: {
                deleted: true
            }
        }, { multi:true });

        let activity = injectUserData({ currentUser }, {
            refOpinion: opinionDetail.refOpinion,
            // dieser Eintrag wird beim Parent angesiedelt
            // da der eigentlich betroffene Detailpunkt nicht verändert wurde
            refDetail: opinionDetail.refParentDetail,
            type: 'SYSTEM-LOG',
            action: 'UPDATE',
            message: `hat die Antwort mit dem Titel <strong>${opinionDetail.title}</strong> als zutreffend ausgewählt.`,
            changes: [{
                message: "Der Handlungsbedarf (Code) wurde geändert.",
                propName: "actionCode",
                oldValue: oldParentDetail.actionCode,
                newValue: opinionDetail.actionCode
            }, {
                message: "Der Handlungsbedarf (Text) wurde geändert.",
                propName: "actionText",
                oldValue: oldParentDetail.actionText,
                newValue: opinionDetail.actionText
            }, {
                message: "Der Handlungsbedarf (Prio) wurde geändert.",
                propName: "actionPrio",
                oldValue: oldParentDetail.actionPrio,
                newValue: opinionDetail.actionPrio
            }]
        }, { created: true });

        Activities.insert(activity);
    },

    /**
     * Create a new Detail for a opinion
     * 
     * @param {Object} detailData Object with all props of the new Detail
     */
    'opinionDetail.insert'(detailData) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        detailData.finallyRemoved = false;

        // check optional data for likes, dislikes, etc.
        if (!detailData.files) detailData.files = [];
        if (!detailData.likes) detailData.likes = [];
        if (!detailData.dislikes) detailData.dislikes = [];
        if (!detailData.commentsCount) detailData.commentsCount = 0;
        if (!detailData.activitiesCount) detailData.activitiesCount = 0;

        let currentUser = Meteor.users.findOne(this.userId);

        if (!hasPermission({ currentUser }, 'opinion.create')) {
            throw new Meteor.Error('Keine Berechtigung zum Erstellen eines neuen Details zu einem Gutachten.');
        }
        
        // the actionPrio will only managed behind the scene
        // and will be used for sorting by actionCode
        if (detailData.actionCode) {
            detailData.actionPrio = actionCodes[detailData.actionCode].orderId;
        }

        const parentDetail = detailData.refParentDetail && OpinionDetails.findOne({ _id: detailData.refParentDetail });
        // determine depth and parentPosition
        if (!parentDetail) {
            // if we got no Parent, we are at top level
            detailData.depth = 1;
            detailData.parentPosition = null;
        } else {
            detailData.depth = parentDetail.depth + 1;
            detailData.parentPosition = (parentDetail.parentPosition || '') + parentDetail.position + '.';
        }

        // check for given position
        // if there is a new position just keep it and move 
        // all siblings + 1 at the end
        let rePositionSiblings = false;
        if (!detailData.position){
            // get max position +1 to insert the detail at the end
            const lastDetailAtSameLevel = OpinionDetails.findOne({
                refOpinion: detailData.refOpinion,
                refParentDetail: detailData.refParentDetail,
                finallyRemoved: false
            }, {
                sort: { position: -1 }
            });
            detailData.position = ((lastDetailAtSameLevel && lastDetailAtSameLevel.position) || 0) + 1;
        } else {
            rePositionSiblings = true;
        }

        // showInToC was removed from ui because of inline-editing style
        // now every heading will be show in ToC
        detailData.showInToC = (detailData.type == 'HEADING' && detailData.depth <= 2);

        let detail = injectUserData({ currentUser }, {...detailData}, { created: true });
        detail.activitiesCount = 1;
        
        if (Meteor.isServer) {
            // render the content that will be shown to the user
            detail.htmlContent = renderTemplate(detail);
        }

        try {
            OpinionDetailSchema.validate(detail);
        } catch (err) {
            throw new Meteor.Error(err.message);
        }
        
        if (rePositionSiblings){
            // get max position +1 to insert the detail at the end
            const lastDetailAtSameLevel = OpinionDetails.update({
                refOpinion: detailData.refOpinion,
                refParentDetail: detailData.refParentDetail,
                finallyRemoved: false,
                position: { $gte: detailData.position }
            }, {
                $inc: { position: 1 }
            }, { multi: true });
        }

        let newId = OpinionDetails.insert(detail);
        
        let activity = injectUserData({ currentUser }, {
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
    'opinionDetail.update'(opinionDetail) {
        check(opinionDetail, Object);
        check(opinionDetail.id, String);
        check(opinionDetail.data, Object);

        // soll das Dokument wiederhergestellt werden
        if (Meteor.isClient && opinionDetail.data.finallyRemoved === false) {
            // das Document kann auf dem client nicht mehr gefunden werden
            // oder geupdated werden, da alle Documents mit finallyRemoved:true
            // nicht mehr gepublished werden
            // deshalb get out of here --> lass den server das machen :-)
            return;
        }

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
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten dieses Details zum Gutachten.');
        }

        // check what has changed
        const { message, changes } = determineChanges({ 
            propList: {
                orderString: { what: 'die Sortierreihenfolge', msg: 'Die Sortierreihenfolge wurde geändert.' },
                type: { what: 'der Typ', msg: 'Der Typ wurde geändert.' },
                title: { what: 'den Titel', msg: 'Der Titel wurde geändert.' },
                text: { what: 'den Text', msg: 'Der Text wurde geändert.' },
                printTitle: { what: 'den Drucktitel', msg: 'Der Drucktitel wurde geändert.' },
                actionCode: { what: 'den Handlungsbedarf', msg: 'Der Handlungsbedarf wurde geändert.' },
                actionText: { what: 'den Text des Handlungsbedarf', msg: 'Der Text des Handlungsbedarfs wurde geändert.' },
                deleted: { what: 'die Löschmarkierung', msg: 'Die Löschmarkierung wurde geändert.' },
                finallyRemoved: { what: 'die endgültige Löschung', msg: 'Das Detail wurde wiederhergestellt.' },
                showInToC: { what: 'die Kennung "Innhaltsverzeichnis"', msg: 'Die Kennung "Inhaltsverzeichnis" wurde geändert.' },
                pagebreakBefore: { what: 'die Einstellung "Seitenumbruch vorab"', msg: 'Die Einstellung "Seitenumbruch vorab" wurde geändert.' },
                pagebreakAfter: { what: 'die Einstellung "Seitenumbruch nachher"', msg: 'Die Einstellung "Seitenumbruch nachher" wurde geändert.' },
            },
            data: opinionDetail.data, 
            oldData: old
        });

        // the actionPrio will only managed behind the scene
        // and will be used for sorting by actionCode
        if (opinionDetail.data.actionCode) {
            opinionDetail.data.actionPrio = actionCodes[opinionDetail.data.actionCode].orderId;
        }

        // are there changes to commit
        if (changes.length) {
            if (Meteor.isServer) {
                // render the content that will be shown to the user
                const itemToRender = { ...old, ...opinionDetail.data };
                opinionDetail.data.htmlContent = renderTemplate(itemToRender);
            }

            const result = OpinionDetails.update(opinionDetail.id, { 
                $set: opinionDetail.data,
                $inc: { activitiesCount: 1 }
            });
            
            
            let activity = injectUserData({ currentUser }, {
                refOpinion: old.refOpinion,
                refDetail: opinionDetail.id,
                type: 'SYSTEM-LOG',
                action: 'UPDATE',
                message,
                changes
            }, { created: true });
            
            Activities.insert(activity);
            
            // at last update the parentDetail with the new Content
            const htmlChildContent = OpinionDetails.find({
                refParentDetail: old.refParentDetail,
                deleted: false,
                finallyRemoved: false
            }, { fields: { htmlContent: 1 }, sort: { position: 1 } }).fetch();

            /*OpinionDetails.update(old.refParentDetail, { 
                $set: {
                    htmlChildContent: 
                        '<ul class="mbac-child-content-list">' + 
                            htmlChildContent.map( ({htmlContent}) => {
                                return `<li>` + htmlContent + '</li>';
                            }).join('') +
                        '</ul>'
                }
            });*/

            return changes;
        }
    },

    /**
     * Deletes an opinions detail from the colection
     * 
     * @param {String} id Id of the detail to remove
     */
    'opinionDetail.remove'(id) {
        this.unblock();

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
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten dieses Details zum Gutachten. Sie können es nciht zum Löschen markieren.');
        }

        OpinionDetails.update(id, {
            $set:{ deleted: true }
        });
       
        let activity = injectUserData({ currentUser }, {
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

        Activities.insert(activity);
    },

    /**
     * Finally mark delete the given opinions detail from the colection
     * 
     * @param {String} id Id of the detail to mark as finallyRemove
     */
    'opinionDetail.finallyRemove'(id) {
        check(id, String);

        this.unblock();

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        let currentUser = Meteor.users.findOne(this.userId);
        const old = OpinionDetails.findOne(id);

        if (!old) {
            throw new Meteor.Error('Das angegebene Detail mit der id ' + id + ' wurde nicht gefunden.');
        }

        // check if opinion was sharedWith the current User
        const shared = Opinions.findOne({
            _id: old.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Dieses Detail zum Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.remove')) {
            throw new Meteor.Error('Keine Berechtigung zum endgültigen Löschen dieses Details zum Gutachten.');
        }

        OpinionDetails.update(id, {
            $set:{ finallyRemoved: true }
        });

        let activity = injectUserData({ currentUser }, {
            refOpinion: old.refOpinion,
            // dieser Eintrag wird beim Parent angesiedelt
            // da der eigentlich betroffene Detailpunkt gelöscht ist
            refDetail: old.refParentDetail,
            refDetailFinallyRemoved: id._str || id,
            type: 'SYSTEM-LOG',
            action: 'FINALLYREMOVE',
            message: `hat das Detail mit dem Titel <strong>${old.title}</strong> gelöscht.`,
            changes: [{
                message: "Das Detail wurde gelöscht.",
                propName: "finallyRemoved",
                oldValue: false,
                newValue: true
            }]
        }, { created: true });

        Activities.insert(activity);
    },

    /**
     * Reposition the given Detail and move alle other details
     * at their new position. At least it will update all referencing
     * Details parentPosition
     * 
     * @param {String} refDetail Specifies the Detail by Id
     * @param {Integer} newPosition New Position to place the Detail
     */
    'opinionDetails.rePosition'(refDetail, newPosition){
        this.unblock();

        check(refDetail, String);
        check(newPosition, Number);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        const old = OpinionDetails.findOne(refDetail);

        if (!old) {
            throw new Meteor.Error('Das angegebene Detail wurde nicht gefunden und kann somit nicht verschoben werden.');
        }

        let currentUser = Meteor.users.findOne(this.userId);

        const shared = Opinions.findOne({
            _id: old.refOpinion,
            "sharedWith.user.userId": this.userId
        });

        if (!shared) {
            throw new Meteor.Error('Dieses Detail zum Gutachten wurde nicht mit Ihnen geteilt.');
        }

        const sharedWithRole = shared.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten dieses Details zum Gutachten.');
        }

        const syncUpdateDetails = Meteor.wrapAsync(OpinionDetails.update, OpinionDetails);

        // Update the detail to it's new Position
        syncUpdateDetails(refDetail, { $set:{ position: newPosition } });

        // update all other details and increase their position
        // if oldPosition is greater than newPosition
        const position = old.position > newPosition ? { $gte: newPosition, $lt: old.position } : { $gt: old.position, $lte: newPosition };
        const incValue = old.position > newPosition ? 1 : -1;
        const query = {
            _id: { $ne: old._id },
            refOpinion: old.refOpinion,
            refParentDetail: old.refParentDetail,
            position
        }

        // get all Ids that were affected by the new position of the item above and should be repositioned too
        const updatedIdsOnSameLevel = OpinionDetails.find(query, { fields: { _id: 1 }}).map( ({ _id }) => _id );
        // and then update them
        syncUpdateDetails({_id: { $in: updatedIdsOnSameLevel }}, { $inc: { position: incValue } }, { multi: true });

        //return;

        // update all Levels below recursiv
        const updateChildren = (ref, newParentPosition) => {
            OpinionDetails.find({
                refParentDetail: ref
            }).forEach( ({ _id, position }) => {
                syncUpdateDetails(_id, {
                    $set: { parentPosition: newParentPosition }
                });
                updateChildren(_id, newParentPosition + position + '.');
            });
        }
        
        // add refDetail to run all in one place
        updatedIdsOnSameLevel.push(refDetail);

        OpinionDetails.find({
            _id: { $in: updatedIdsOnSameLevel }
        }, {
            fields: { _id:1, position: 1}
        }).forEach( ({ _id, position }) => {
            // Update all children of the repositioned Item
            updateChildren( _id, (old.parentPosition || '') + position + '.');
        });
    }
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