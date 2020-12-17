import { Meteor } from 'meteor/meteor';
import { Images } from '/imports/api/collections/images';

/**
 * Publish images
 * 
 * @param0 {Any} refImages  [Array of _id's] String:_id or null| undefined
 */
Meteor.publish('images', function (refImages) {
    if (Array.isArray(refImages)) {
        return Images.find( { _id: { $in:refImages } } ).cursor;    
    } else if ((typeof refImages === 'string' || refImages instanceof String)) {
        return Images.find( { _id: refImages } ).cursor; 
    } else {
        return Images.find().cursor;
    }
});