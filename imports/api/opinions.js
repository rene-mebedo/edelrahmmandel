import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import SimpleSchema from  'simpl-schema';

import { UserSchema, SharedWithSchema } from './sharedSchemas/user';
import { AddressSchema } from './sharedSchemas/address';
import { ParticipantSchema } from './sharedSchemas/participant';

export const OpinionsSchema = new SimpleSchema({
    title: {
        type: String,
        label: 'Titel',
        max: 100,
    },
    description: {
        type: String,
        label: 'Beschreibung'
    },
    customer: {
        type: AddressSchema,
        label: 'Auftraggeber'
    },
    dateFrom: {
        type: Date,
        label: 'Datum von',
    },
    dateTill: {
        type: Date,
        label: 'Datum bis',
    },
    participants: Array,
    'participants.$': {
        type: ParticipantSchema,
        minCount: 0
    },
    createdAt: {
        type: Date,
        label: 'Erstellt am',
        defaultValue: new Date
    },
    createdBy: {
        type: UserSchema,
        label: 'Erstellt von'
    },
    sharedWith: {
        type: SharedWithSchema,
        label: 'Geteilt mit'
    }
});

export const OpinionsCollection = new Mongo.Collection('opinions');
OpinionsCollection.attachSchema(OpinionsSchema);


Meteor.methods({
    'opinion.insert'(opinionData) {
        check(opinionData, Object);

        OpinionsSchema.validate(opinionData);
        
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        let u = Meteor.users.findOne(this.userId);
        console.log(u);

        OpinionsCollection.insert({
            ...opinionData,
            createdAt: new Date,
            createdBy: this.userId,
            sharedWith: [
                { userId: this.userId, role: "OWNER" }
            ]
        });
    }
  });
  