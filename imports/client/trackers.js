import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { OpinionDetails } from '../api/collections/opinionDetails';
import { Opinions } from '../api/collections/opinions';
import { Roles } from '../api/collections/roles';
import { Activities } from '../api/collections/activities';
import { UserActivities } from '../api/collections/userActivities';
import { Images } from '../api/collections/images';
import { Layouttypes } from '../api/collections/layouttypes';
import { OpinionPdfs } from '../api/collections/opinion-pdfs';
import { Avatars } from '../api/collections/avatars';

export const useOpinionSubscription = id => useTracker( () => {
    const subscription = Meteor.subscribe('opinions', id)
    return !subscription.ready();
});

/**
 * Reactive current User Account
 */
export const useAccount = () => useTracker(() => {
    const user = Meteor.user();
    const userId = Meteor.userId();

    const subscription = Meteor.subscribe('currentUser');
    let currentUser = null;

    if (subscription.ready()) {
        currentUser = Meteor.users.findOne({_id:userId}, { fields: { username: 1, userData: 1 }});
    }

    return {
        user,
        userId,
        currentUser,
        isLoggedIn: !!userId,
        accountsReady: user !== undefined && subscription.ready()
    }
}, [])

/**
 * Reactive Roles handling
 * 
 */
export const useRoles = () => useTracker( () => {
    const noDataAvailable = [ [] /*Roles*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const subscription = Meteor.subscribe('roles');

    if (!subscription.ready()) { 
        return noDataAvailable;
    }

    const roles = Roles.find({}, { sort: {title: 1}}).fetch();

    return [roles, false];
});

/**
 * Reactive Layouttypes
 * 
 */
export const useLayouttypes = () => useTracker( () => {
    const noDataAvailable = [ [] /*Layouttypes*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const subscription = Meteor.subscribe('layouttypes');

    if (!subscription.ready()) { 
        return noDataAvailable;
    }

    const layouttypes = Layouttypes.find({}).fetch();

    return [layouttypes, false];
});


/**
 * Load the Opinion by its ID reactively
 * 
 * @param {String} refOpinion Id of the Opinion
 */
export const useOpinion = refOpinion => useTracker( () => {
    const noDataAvailable = [ null /*opinion*/,  true /*loading*/ ];

    if (!Meteor.user()) {
        return noDataAvailable;
    }

    const handler = Meteor.subscribe('opinions', refOpinion)
    if (!handler.ready()) {
        return noDataAvailable;
    }

    const opinion = Opinions.findOne(refOpinion);

    return [opinion, false];
}, [refOpinion]);

/**
 * Load all Opinions reactively
 * 
 */
export const useOpinions = () => useTracker( () => {
    const noDataAvailable = [ [] /*opinions*/,  true /*loading*/ ];

    if (!Meteor.user()) {
        return noDataAvailable;
    }

    const handler = Meteor.subscribe('opinions');
    if (!handler.ready()) {
        return noDataAvailable;
    }

    const opinions = Opinions.find({}, { sort: { opinionNo: -1 } }).fetch();

    return [opinions, false];
});

/**
 * Load the given OpinionDetail reactivly.
 * 
 * @param {String} refOpinion   id of the Opinion
 * @param {String} refDetail    id of the OpinionDetail
 */
export const useOpinionDetail = (refOpinion, refDetail) => useTracker( () => {
    const noDataAvailable = [ null /*opinionDetail*/,  true /*loading*/ ];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('opinionDetail', { refOpinion, refDetail });

    if (!handler.ready()) {
        return noDataAvailable;
    }

    detail = OpinionDetails.findOne(refDetail);

    return [detail, false];
}, [refOpinion, refDetail]);


/**
 * Load the given OpinionDetail reactivly.
 * 
 * @param {String} refOpinion   id of the Opinion
 * @param {String} refDetail    id of the OpinionDetail
 * @param {Function} callback    Function that will be invoked at rerun
 */
export const useOpinionDetails = (refOpinion, refParentDetail, callback) => useTracker( () => {
    const noDataAvailable = [ [] /*opinionDetails*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('opinionDetails', { refOpinion, refParentDetail });

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    let opinionDetails;
    if (refParentDetail) {
        opinionDetails = OpinionDetails.find({ refParentDetail }, { sort: {position: 1}}).fetch();
    } else {
        opinionDetails = OpinionDetails.find({ refOpinion, refParentDetail: null }, { sort: {position: 1}}).fetch();
    }

    if (callback) callback(opinionDetails);

    return [opinionDetails, false];
}, [refOpinion, refParentDetail]);


/**
 * Load Activities reactivly for a given opinion or opinionDetail
 * 
 * @param {String} refOpinion   id of the Opinion
 * @param {String} refDetail    id of the OpinionDetail
 */
export const useActivities = (refOpinion, refDetail) => useTracker( () => {
    const noDataAvailable = [ [] /*activities*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const subscription = Meteor.subscribe('activities', { refOpinion, refDetail });

    if (!subscription.ready()) {
        return noDataAvailable;
    }

    let activities;
    if (refDetail) {
        activities = Activities.find({ refDetail }, { sort: { createdAt: 1}}).fetch();
    } else {
        activities = Activities.find({ refOpinion, refDetail: null }, { sort: { createdAt: 1} }).fetch();
    }

    return [ activities, false ];
}, [refOpinion, refDetail]);


/**
 * Returns the count of unread user-activities reactively
 * 
 */
export const useUserActivityCount = () => useTracker( () => {
    const noDataAvailable = [ null , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const subscription = Meteor.subscribe('userActivities');

    if (!subscription.ready()) {
        return noDataAvailable;
    }

    const count = UserActivities.find({ unread: true }).count();

    return [ count, false ];
}, []);

/**
 * Load the userActivities reactivly
 * 
 * @param {String} refOpinion   id of the Opinion
 * @param {String} refDetail    id of the OpinionDetail
 */
export const useUserActivities = ({orderBy}) => useTracker( () => {
    const noDataAvailable = [ [] /*activities*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const subscription = Meteor.subscribe('userActivities');

    if (!subscription.ready()) {
        return noDataAvailable;
    }

    const sort = orderBy || { createdAt: 1};
    return [
        UserActivities.find({}, { sort }).fetch(),
        false
    ];
});


/**
 * Load the userActivities reactivly
 * 
 * @param {String} refOpinion   id of the Opinion
 * @param {String} refDetail    id of the OpinionDetail
 */
export const useImages = refImages => useTracker( () => {
    const noDataAvailable = [ [] /*images*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const subscription = Meteor.subscribe('images', refImages);

    if (!subscription.ready()) {
        return noDataAvailable;
    }

    let images = [];
    if (Array.isArray(refImages)) {
        images = Images.find( { _id: { $in: refImages } } ).fetch();    
    } else if ((typeof refImages === 'string' || refImages instanceof String)) {
        images = Images.find( { _id: refImages } ).fetch(); 
    } else {
        images = Images.find().fetch();
    }
    return [
        images.map( file => {
            let link = Images.findOne({_id: file._id}).link();
            file.link = link;
            if ( file.meta
              && file.meta.annotStateImageId ) {
                let link2 = Images.findOne({_id: file.meta.annotStateImageId}).link();
                file.link2 = link2;
            }
            return file;
        }),
        false
    ];
});



/**
 * Load all opinionDetails with Type ANSWER and actionText for the given Opinion that should listed
 * in the actionlist orderd by actioncode
 * 
 * @param {String} refOpinion Specifies the opinion
 */
export const useOpinionActionList = refOpinion => useTracker( () => {
    const noDataAvailable = [ [] /*actionListitems*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const subscription = Meteor.subscribe('opinionDetailsActionListitems', refOpinion);

    if (!subscription.ready()) {
        return noDataAvailable;
    }

    // Ursprüngliche Version.
    /*let actionListitems = OpinionDetails.find({
        refOpinion,
        type: 'QUESTION', //{ $in: [ 'QUESTION', 'ANSWER'] },
        deleted: false,
        finallyRemoved: false,
        actionCode: { $ne: 'okay' },
        actionText: { $ne: null }
    }, {
        fields: {
            _id: 1,
            refOpinion: 1,
            actionCode: 1,
            actionText: 1
        },
        sort: {
            actionPrio: 1,
            //orderString: 1,
            parentPosition: 1,
            position: 1
        }
    }).map(item => {
        item.key = item._id;
        return item;
    });*/

    // Prüfen, ob ein Parent Element vorhanden ist und dies gelöscht (deleted oder finallyRemoved) ist.
    isParentDeleted = ( parentDetailId ) => {
        if ( !parentDetailId )
            return false;
        const parentDetail = OpinionDetails.findOne({_id: parentDetailId});
        if ( !parentDetail )
            return false;
        else {
            if ( !parentDetail.deleted
              && !parentDetail.finallyRemoved ) {
                return isParentDeleted( parentDetail.refParentDetail );
            }                
        }
        return true;// Nur, wenn Parent Element vorhanden und gelöscht ist.
    }
    // Hier wurde bisher nicht berücksichtigt, dass Parent Elemente gelöscht sein können!
    // Daher im 1. Schritt das Array mit allen nicht gelöschten Fragen mit Handlungsempfehlung/Maßnahme ermitteln.
    const actionListitems = OpinionDetails.find({
        refOpinion,
        type: 'QUESTION', //{ $in: [ 'QUESTION', 'ANSWER'] },
        deleted: false,
        finallyRemoved: false,
        actionCode: { $ne: 'okay' },
        actionText: { $ne: null }
    }, {
        fields: {
            _id: 1,
            refOpinion: 1,
            actionCode: 1,
            actionText: 1,
            refParentDetail: 1
        },
        sort: {
            actionPrio: 1,
            //orderString: 1,
            parentPosition: 1,
            position: 1
        }
    }).fetch();

    let actionListitems2 = [];
    // Für jede Frage die Parent Elemente auf Löschung prüfen.
    actionListitems.forEach( element => {
        if ( !isParentDeleted( element.refParentDetail ) )
            actionListitems2.push( element );
    })

    // Am Ende noch die Keys setzen.
    actionListitems2.map(item => {
        item.key = item._id;
        return item;
    });
    
    return [ actionListitems2, false ];
}, [refOpinion]);

/**
 * Load the given Pdf-meta-data for the given opinion.
 * 
 * @param {String} refOpinion   id of the Opinion
 */
export const useOpinionPdfs = refOpinion => useTracker( () => {
    const noDataAvailable = [ [] /*opinionPdfs*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('opinion-pdfs', refOpinion);

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const data = OpinionPdfs.find({ "meta.refOpinion": refOpinion }, { sort: { 'meta.createdAt': -1 }}).fetch();

    return [
        data.map( file => {
            let link = OpinionPdfs.findOne({_id: file._id}).link();
            file.link = link;
            return file;
        }), 
        false
    ];
}, [refOpinion]);


/**
 * Load the current Avatar for the given user
 * 
 * @param {String} userId   Specifies the user
 */
export const useAvatar = userId => useTracker( () => {
    const noDataAvailable = [ null /*avatar*/ , true /*loading*/];

    if (!Meteor.user()) {
        return noDataAvailable;
    }
    const handler = Meteor.subscribe('avatar', userId);

    if (!handler.ready()) { 
        return noDataAvailable;
    }

    const avatar = Avatars.findOne({ userId });

    return [
        avatar ? avatar.link() : null,
        false
    ];
}, [userId]);
