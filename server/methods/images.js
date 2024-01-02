import { Meteor } from 'meteor/meteor';
import { Images } from './../../imports/api/collections/images';

Meteor.methods({
    'images.update.annotState'(id, dataState, imageId){
        Images.collection.update(id, {
            $set: {
                'meta.annotState': dataState,
                'meta.annotStateImageId': imageId
            }
        });
    },
    // Umstellung auf Async für Meteor Version 2.8, https://guide.meteor.com/2.8-migration
    async 'images.update.annotStateAsync'(id, dataState, imageId){
        await Images.collection.updateAsync(id, {
            $set: {
                'meta.annotState': dataState,
                'meta.annotStateImageId': imageId
            }
        });
    }
});