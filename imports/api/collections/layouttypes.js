import { Mongo } from 'meteor/mongo';

import SimpleSchema from  'simpl-schema';

export const LayouttypeSchema = new SimpleSchema({
    title: {
        type: String,
        label: 'Kurzbezeichnung'
    },
    description: {
        type: String,
        label: 'Ein Erläuterungstext',
        optional: true
    },
    hasChilds: {
        type: Boolean,
        defaultValue: false
    }
});

export const Layouttypes = new Mongo.Collection('layouttypes');
Layouttypes.attachSchema(LayouttypeSchema);
