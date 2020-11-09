import { Mongo } from 'meteor/mongo';

import SimpleSchema from  'simpl-schema';

import { CreationSchema } from '../sharedSchemas/user';

export const ActivitySchema = new SimpleSchema({
    refOpinion: {
        type: String,
        label: 'Gutachten-Referenz'
    },
    refDetail: {
        type: String,
        label: 'Gutachten-Referenz auf Detailpunkt',
        optional: true
    },
    type: {
        type: String // USER-POST, SYSTEM-LOG
    },
    action: {
        type: String, // INSERT, UPDATE, REMOVE
        optional: true // only supported if type was SYSTEM-LOG
    },
    message: {
        type: String,
        label: 'Aktivitätsnachricht'
    },
    feedback: {
        type: Array,
        optional: true
    },
    "feedback.$": {
        type: Object
    },
    response: {
        type: Array,
        optional: true
    },
    "response.$": {
        type: Object
    },
    changes: {
        type: Array,
        optional: true
    },
    "changes.$": {
        type: Object,
        blackbox: true
    }
});

ActivitySchema.extend(CreationSchema);

export const Activities = new Mongo.Collection('activities');
Activities.attachSchema(ActivitySchema);
