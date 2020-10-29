import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '/imports/api/collections/opinions';
import { OpinionDetails } from '/imports/api/collections/opinionDetails';

Meteor.publish('opinionDetails', function publishOpinionDetails({ refOpinion, refParentDetail }) {
    let permitted = Opinions.findOne({
        _id: refOpinion,
        "sharedWith.user.userId": this.userId
    });

    if (!permitted) return null;

    if (refParentDetail)
        return OpinionDetails.find({ refParentDetail });
    if (refOpinion)
        return OpinionDetails.find({ refOpinion, refParentDetail });
});
