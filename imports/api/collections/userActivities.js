import { Mongo } from 'meteor/mongo';

import SimpleSchema from  'simpl-schema';

import { CreationSchema } from '../sharedSchemas/user';

export const UserActivitySchema = new SimpleSchema({
    refUser: {
        type: String,
        label: 'Benutzer'
    },
    type: {
        type: String, // "MENTIONED", etc. ??
        label: 'Typ',
    },
    refs: {
        type: Object,
        blackbox: true,
        label: 'Referenzierungen'
    },
    message: {
        type: String,
        label: 'Aktivitätsnachricht'
    },
    originalContent: {
        type: String,
        label: 'originaler Content'
    },
    unread: {
        type: Boolean,
        defaultValue: true,
        label: 'Ungelesen'
    },
    mailsent: {
        type: Boolean,
        defaultValue: false,
        optional: true,
        label: 'Erinnerungsmail gesandt'
    }
});

UserActivitySchema.extend(CreationSchema);

export const UserActivities = new Mongo.Collection('useractivities');
UserActivities.attachSchema(UserActivitySchema);

UserActivities.allow ({
    insert() { return false; },
    update() { return false; },
    remove() { return false; },
});