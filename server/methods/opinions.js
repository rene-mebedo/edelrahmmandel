import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

import { Opinions } from '../../imports/api/collections/opinions';

import { hasPermission } from '../../imports/api/helpers/roles';
import { escapeRegExp } from '../../imports/api/helpers/basics';

import opinionDocumenter from 'opinion-documenter';
import { OpinionDetails } from '../../imports/api/collections/opinionDetails';
import { Images } from '../../imports/api/collections/images';
import { OpinionPdfs } from '../../imports/api/collections/opinion-pdfs';

import { actionCodes } from '../../imports/api/constData/actioncodes'; 

import fs from 'fs';

const readFile = Meteor.wrapAsync(fs.readFile, fs);
const writePdf = Meteor.wrapAsync(OpinionPdfs.write, OpinionPdfs);

const settings = JSON.parse(process.env.MGP_SETTINGS);

import { rePositionDetails } from '../../imports/api/helpers/opinionDetails';


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
     * @param {Boolean} previewOnly Specifies whether the pdf should 
     *                              be renderd as preview and will not saved 
     *                              to disk or without preview stored in the system
     */
    async 'opinion.createPDF'(refOpinion, previewOnly = false) {
        check(refOpinion, String);
        check(previewOnly, Match.OneOf(String, Boolean));

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

        rePositionDetails(refOpinion, { reRenderHtmlContent: true });
        const details = OpinionDetails.find({
            refOpinion,
            deleted: false,
            finallyRemoved: false
        }).fetch();
        
        let detailsTodolist = OpinionDetails.find({
            refOpinion,
            type: 'QUESTION',
            deleted: false,
            finallyRemoved: false,
            actionCode: { $ne: 'okay' },
            actionText: { $ne: null }
        }, {
            fields: {
                _id: 1,
                actionCode: 1,
                actionText: 1,
                actionPrio: 1,
                parentPosition: 1,
                position: 1
            },
            sort: {
                actionPrio: 1,
                parentPosition: 1,
                position: 1
            }
        }).fetch();

        // Sortierung der detailsTodolist numerisch.
        /* Das (Sortierung des Arrays) ist notwendig, weil leider Funktionalität Mongo collation nicht enthalten ist unter Meteor.
        Mit collation wäre nur folgendes notwendig in find():        
        collation: {
                locale: 'de',
                numericOrdering: true
            }
        https://forums.meteor.com/t/is-there-a-way-to-use-mongodb-3-4-collation/33024/13
        */
        let sortedDetailsTodolist = [];
        Object.keys( actionCodes ).forEach( code => {
            let filteredItems = detailsTodolist.filter( item => item.actionCode === code );
            filteredItems = filteredItems.sort( (a , b) => {
                if ( !a
                  || !a.parentPosition
                  || !a.position )
                    return -1;
                else if ( !b
                       || !b.parentPosition
                       || !b.position )
                    return 1;
                return (a.parentPosition.toString() + a.position.toString()).localeCompare( (b.parentPosition.toString() + b.position.toString()) , undefined , { numeric: true } );
            });

            filteredItems.forEach( item => {
                sortedDetailsTodolist.push( item );
            });
        });

        const images = Images.find({
            'meta.refOpinion': refOpinion
        }).fetch();
        
        let fileData, fileRef;

        try {
            let filename;
            // async pdfCreate ( opinion , opinionDetails , detailsTodoList , images , path , hasAbbreviationsPage = true , hasToC = true , print = false , ToCPageNos = true )
            if (previewOnly === 'livepreview') {
                filename = await opinionDocumenter.pdfCreate(opinion, details, sortedDetailsTodolist, images , settings.PdfPath, true, false, true, false);
            } else {
                filename = await opinionDocumenter.pdfCreate(opinion, details, sortedDetailsTodolist, images , settings.PdfPath);
            }

            fileData = readFile(filename);

            fileRef = writePdf(fileData, {
                fileName: `${refOpinion}.pdf`,
                type: 'application/pdf',
                meta: {
                    refOpinion, 
                    preview: !!previewOnly,
                    createdAt: new Date(), 
                    createdBy: {
                        userId: currentUser._id,
                        firstName: currentUser.userData.firstName,
                        lastName: currentUser.userData.lastName
                    }
                }
            });

            if (previewOnly) {
                // löschen der Previewversion
                Meteor.setTimeout(() => {
                    OpinionPdfs.remove({_id: fileRef._id});
                }, 1000 * 60 /* 1 Minute */)
            }

            fs.unlinkSync(filename);
        } catch (err) {
            throw new Meteor.Error(err);
        }

        const result = OpinionPdfs.findOne({_id:fileRef._id}).link(); 
        //if (previewOnly) {
            return result;
        //}
    }
});