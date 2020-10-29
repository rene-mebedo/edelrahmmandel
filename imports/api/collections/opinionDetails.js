import { Mongo } from 'meteor/mongo';

import SimpleSchema from  'simpl-schema';

import { CreationSchema } from '../sharedSchemas/user';

export const OpinionDetailSchema = new SimpleSchema({
    refOpinion: {
        type: String,
        label: 'Gutachten-Referenz'
    },
    refParentDetail: {
        type: String,
        label: 'Parent-Referenz',
        optional: true
    },
    type: {
        type: String,
        label: 'Layout/Type'
    },
    title: {
        type: String,
        label: 'Titel',
    },
    text: {
        type: String,
        label: 'Text'
    },
    /*descriptionEx: {
        type: String,
        label: 'Kommentar 2',
        optional: true
    },*/
    actionCode: {
        type: String,
        label: 'Handlungsbedarf',
        optional: true
    },
    info: {
        type: String,
        label: 'Hinweis',
        optional: true
    },
    step: {
        type: String,
        label: 'Maßnahme',
        optional: true
    },
    specification: {
        type: String,
        label: 'Vorschrift',
        optional: true
    },
});

OpinionDetailSchema.extend(CreationSchema);

export const OpinionDetails = new Mongo.Collection('opinionDetails');
OpinionDetails.attachSchema(OpinionDetailSchema);
