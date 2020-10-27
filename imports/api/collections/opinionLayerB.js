import { Mongo } from 'meteor/mongo';

import SimpleSchema from  'simpl-schema';

import { CreationSchema } from '../sharedSchemas/user';

export const OpinionLayerBSchema = new SimpleSchema({
    refOpinion: {
        type: String,
        label: 'Gutachten-Referenz'
    },
    refOpinionLayerA: {
        type: String,
        label: 'Gutachten-Referenz auf LayerA-Eintrag'
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
    }
});

OpinionLayerBSchema.extend(CreationSchema);

export const OpinionLayerB = new Mongo.Collection('opinionLayerB');
OpinionLayerB.attachSchema(OpinionLayerBSchema);
