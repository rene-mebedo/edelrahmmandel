import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Opinions } from '../../imports/api/collections/opinions';

import { hasPermission } from '../../imports/api/helpers/roles';
import { escapeRegExp } from '../../imports/api/helpers/basics';

import opinionDocumenter from 'opinion-documenter';
import { OpinionDetails } from '../../imports/api/collections/opinionDetails';
import { OpinionPdfs } from '../../imports/api/collections/opinion-pdfs';

Meteor.methods({
    /**
     * Returns all Opinions that are shared with the current user
     * 
     * @param {String} searchText Specifies a searchText
     */
    'opinions.getSharedOpinions'(searchText){
        if (searchText !== undefined && searchText !== null) {
            check(searchText, String);
        }

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        
        const escapedText = escapeRegExp(searchText);
        
        // check if opinion was sharedWith the current User
        const shared = Opinions.find({
            $and: [
                { "sharedWith.user.userId": this.userId },
                { $or: [
                    { 'title': { $regex : escapedText, $options:"i" } },
                    { 'description': { $regex : escapedText, $options:"i" } },
                    { 'opinionNo': { $regex : escapedText, $options:"i" } },
                    { 'customer.name': { $regex : escapedText, $options:"i" } },
                ]}
            ]
        }).map( o => {
            const calcTitle = o.customer
                ? o.title + ' Nr. ' + o.opinionNo + ' (' + o.customer.name + ' ' + o.customer.city + ')'
                : o.title;

            return {
                _id: o._id,
                title: calcTitle
            }
        });
        
        return shared;
    },

    /**
     * Creates a new PDF for the given Opinion and store the
     * file in the files collection to get a secure download
     * 
     * @param {String} refOpinion Specifies the ID of the opinion
     */
    async 'opinion.createPDF'(refOpinion) {
        check(refOpinion, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const currentUser = Meteor.users.findOne(this.userId);

        // ... and check then if the current-user is member of sharedWith
        const opinion = Opinions.findOne({
            _id: refOpinion,
            'sharedWith.user.userId': this.userId
        });

        if (!opinion) {
            throw new Meteor.Error('Das angegebene Gutachten wurde nicht mit Ihnen geteilt und Sie können daher kein PDF erzeugen.');
        }

        const sharedWithRole = opinion.sharedWith.find( s => s.user.userId == this.userId );
        
        if (!hasPermission({ currentUser, sharedRole: sharedWithRole.role }, 'opinion.edit')) {
            throw new Meteor.Error('Keine Berechtigung zum Bearbeiten (Erstellen eines PDF) des angegebenen Gutachtens.');
        }

        const details = OpinionDetails.find({
            refOpinion,
            deleted: false,
            finallyRemoved: false
        }).fetch();
        
        console.log('start PDF');
        const filename = `/home/rene/meteor/data/gutachten/${refOpinion}.pdf`;
        const outputHtml = await opinionDocumenter.pdfCreate(opinion, details, filename);
        console.log('PDF created');

        OpinionPdfs.load(filename, {
            fileName: `file://${refOpinion}.pdf`,
            meta: { refOpinion }
        });

        const res = OpinionPdfs.find({}).fetch()
        console.log(res);

        /*upload = OpinionPdfs.insert({
            file,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            meta: { refOpinion }
        }, false);
    
        upload.on('start', function () {
            //console.log('upload start', this)
        });

        upload.on('end', function (error, fileObj) {
            //console.log('upload end', error, fileObj)
            if (error) {
                message.error(`Fehler beim Upload: ${error}`);
                //console.log(`Error during upload: ${error}`);
            } else {
                console.log(`File successfully uploaded`, fileObj);
                const data = {
                    refOpinion,
                    refParentDetail: refDetail, // the new parent is the current detail
                    type: 'PICTURE',
                    title: fileObj.name,
                    printTitle: fileObj.name,
                    text: 'Bildtext',
                    files: [fileObj]
                }

                Meteor.call('opinionDetail.insert', data, (err, res) => {
                    if (err) {
                        message.error(`${err.message} file upload failed.`);
                    }
                });
            }
        });

        upload.start();*/

        return 'Finished';
    }
});