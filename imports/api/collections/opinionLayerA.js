import { Mongo } from 'meteor/mongo';

import SimpleSchema from  'simpl-schema';

import { CreationSchema } from '../sharedSchemas/user';

export const OpinionLayerASchema = new SimpleSchema({
    refOpinion: {
        type: String,
        label: 'Gutachten-Referenz'
    },
    type: {
        type: String,
        label: 'Layout/Type'
    },
    kurzbezeichnung: {
        type: String,
        label: 'Beschreibung',
    },
    kommentar1: {
        type: String,
        label: 'Kommentar 1'
    },
    kommentar2: {
        type: String,
        label: 'Kommentar 2',
        optional: true
    },
    kommentar3: {
        type: String,
        label: 'Kommentar 3',
        optional: true
    },
    handlungsbedarf: {
        type: String,
        label: 'Handlungsbedarf',
        optional: true
    },
    hinweis: {
        type: String,
        label: 'Hinweis',
        optional: true
    },
    massnahme: {
        type: String,
        label: 'Maßnahme',
        optional: true
    },
    vorschrift: {
        type: String,
        label: 'Vorschrift',
        optional: true
    },
});

OpinionLayerASchema.extend(CreationSchema);

export const OpinionLayerA = new Mongo.Collection('opinionLayerA');
OpinionLayerA.attachSchema(OpinionLayerASchema);
