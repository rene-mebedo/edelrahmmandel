import { FilesCollection } from 'meteor/ostrio:files';
import { Opinions } from '../collections/opinions';
import { OpinionDetails } from '../collections/opinionDetails';

let ImageConfig = {
    collectionName: 'images',
    downloadRoute: '/files/images',
    allowClientCode: false, // Disallow remove files from Client
    onBeforeUpload(file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
            return true;
        }
        return 'Please upload image, with size equal or less than 10MB';
    },
    downloadCallback(fileObj) {
        console.log('downloadCallback:',fileObj)
        return true;

        if (this.params.query.download == 'true') {
          // Increment downloads counter
          Images.update(fileObj._id, {$inc: {'meta.downloads': 1}});
        }
        // Must return true to continue download
        return true;
    },
    protected(fileObj) {
        console.log('\n\n\n\nprotected:',fileObj);
        return true;

        // read the opinionDetail where the file belongs to ...
        const detail = OpinionDetails.findOne({
            'files._id': fileObj._id
        });

        if (!detail) return false;
        // ... and check then if the current-user is member of sharedWith
        const opinion = Opinions.findeOne({
            _id: detail.refOpinion,
            'sharedWith.user.userId': this.userId
        });

        if (!opinion) return false;

        return true;
        
        // Check if current user is owner of the file
        if (fileObj.meta.owner === this.userId) {
            return false;
        }
        return false;
    }
};

if (Meteor.isServer){
    const settings = JSON.parse(process.env.MGP_SETTINGS);
    ImageConfig.ImagePath = settings.ImagePath;
}

export const Images = new FilesCollection(ImageConfig);