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

Meteor.publish('opinionDetailsActionListitems', function publishOpinionDetailsActionListitems(refOpinion) {
    let permitted = Opinions.findOne({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;

    // Alt:
    /*return OpinionDetails.find({ 
        refOpinion,
        //type: 'QUESTION', //{ $in: ['QUESTION', 'ANSWER'] },
        type: { $in: ['QUESTION', 'HEADING'] },
        deleted: false,
        finallyRemoved: false,
        actionCode: { $ne: 'okay' },
        actionText: { $ne: null }
    });*/
    // Es werden alle Fragen und Überschriften zu dieser Opinion "geladen", damit zu Fragen auch gelöschte ParentDetails (also Überschriften) ermittelt werden können.
    return OpinionDetails.find({ 
        refOpinion,
        type: { $in: ['QUESTION', 'HEADING'] }
    });
});

