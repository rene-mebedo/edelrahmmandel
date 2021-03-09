import { Meteor } from 'meteor/meteor';
import { Images } from './../../imports/api/collections/images';

Meteor.methods({
    'images.update.annotState'(id, data){
        Images.collection.update(id, {
            $set: {
                'meta.annotState':  data
            }
        });
    }
});