import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '/imports/api/collections/opinions';
import { OpinionDetails } from '/imports/api/collections/opinionDetails';

Meteor.publish('opinionDetail', function publishOpinionDetail({ refOpinion, refDetail }) {
    let permitted = Opinions.findOne({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;

    return OpinionDetails.find({ _id: refDetail, finallyRemoved: false });
});

// Umstellung auf Async für Meteor Version 2.8, https://guide.meteor.com/2.8-migration
Meteor.publish('opinionDetailAsync', async function publishOpinionDetailAsync({ refOpinion, refDetail }) {
    let permitted = await Opinions.findOneAsync({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;

    return OpinionDetails.find({ _id: refDetail, finallyRemoved: false });
});

Meteor.publish('opinionDetails', function publishOpinionDetails({ refOpinion, refParentDetail }) {
    let permitted = Opinions.findOne({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;

    if (refParentDetail)
        return OpinionDetails.find({ refParentDetail, finallyRemoved: false });
    if (refOpinion)
        return OpinionDetails.find({ refOpinion, refParentDetail, finallyRemoved: false });
});

// Umstellung auf Async für Meteor Version 2.8, https://guide.meteor.com/2.8-migration
Meteor.publish('opinionDetailsAsync', async function publishOpinionDetailsAsync({ refOpinion, refParentDetail }) {
    let permitted = await Opinions.findOneAsync({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;
    if (refParentDetail)
        return OpinionDetails.find({ refParentDetail, finallyRemoved: false });
    if (refOpinion)
        return OpinionDetails.find({ refOpinion, refParentDetail, finallyRemoved: false });
});

Meteor.publish('opinionDetailsSpellcheck', function publishOpinionDetailsSpellcheck({ refOpinion }) {
    let permitted = Opinions.findOne({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;

    return OpinionDetails.find({ 
        $and: [
            { refOpinion }, 
            { deleted: false },
            { finallyRemoved: false },
            { type: { $nin: ['PAGEBREAK', 'TODOLIST', 'TODOITEM', 'TODOITEMACTIONHEAD'] }},
            { 
                $or: [
                    { spellchecked: false },
                    { spellchecked: { $exists: false } }
                ]
            }
        ]
    });
});

// Umstellung auf Async für Meteor Version 2.8, https://guide.meteor.com/2.8-migration
Meteor.publish('opinionDetailsSpellcheckAsync', async function publishOpinionDetailsSpellcheckAsync({ refOpinion }) {
    let permitted = await Opinions.findOneAsync({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;

    return OpinionDetails.find({ 
        $and: [
            { refOpinion }, 
            { deleted: false },
            { finallyRemoved: false },
            { type: { $nin: ['PAGEBREAK', 'TODOLIST', 'TODOITEM', 'TODOITEMACTIONHEAD'] }},
            { 
                $or: [
                    { spellchecked: false },
                    { spellchecked: { $exists: false } }
                ]
            }
        ]
    });
});

Meteor.publish('opinionDetailsActionListitems', function publishOpinionDetailsActionListitems(refOpinion) {
    let permitted = Opinions.findOne({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;
    return OpinionDetails.find({ 
        refOpinion,
        type: 'QUESTION', //{ $in: ['QUESTION', 'ANSWER'] },
        deleted: false,
        finallyRemoved: false,
        actionCode: { $ne: 'okay' },
        actionText: { $ne: null }
    });
});

// Umstellung auf Async für Meteor Version 2.8, https://guide.meteor.com/2.8-migration
Meteor.publish('opinionDetailsActionListitemsAsync', async function publishOpinionDetailsActionListitemsAsync(refOpinion) {
    let permitted = await Opinions.findOneAsync({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;
    return OpinionDetails.find({ 
        refOpinion,
        type: 'QUESTION', //{ $in: ['QUESTION', 'ANSWER'] },
        deleted: false,
        finallyRemoved: false,
        actionCode: { $ne: 'okay' },
        actionText: { $ne: null }
    });
});