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
    printTitle: {
        type: String,
        optional: true,
        defaultValue: null,
        label: 'Titel im Druck',
    },
    text: {
        type: String,
        label: 'Text',
        optional: true // z.B. der Punkte 4. Befragung hat keinen weiteren Detailtext
    },
    orderString: {
        type: String,
        label: 'Sortierung'
    },
    actionCode: {
        type: String,
        label: 'Handlungsbedarf',
        optional: true
    },
    /*info: {
        type: String,
        label: 'Hinweis',
        optional: true
    },*/
    step: { // nur benötigt als Maßnahmentext für Einträge vom Typ "Antwort"
        type: String,
        label: 'Maßnahme',
        optional: true
    },
    /*specification: {
        type: String,
        label: 'Vorschrift',
        optional: true
    },*/
    deleted: {
        type: Boolean,
        optional: true,
        defaultValue: false
    }
});

OpinionDetailSchema.extend(CreationSchema);

export const OpinionDetails = new Mongo.Collection('opinionDetails');
OpinionDetails.attachSchema(OpinionDetailSchema);

OpinionDetails.allow ({
    insert() { return false; },
    update() { return false; },
    remove() { return false; },
})