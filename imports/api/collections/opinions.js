import { Mongo } from 'meteor/mongo';

import SimpleSchema from  'simpl-schema';

import { 
    CreationSchema,
    SharedWithSchema
} from '../sharedSchemas/user';
import { AddressSchema } from '../sharedSchemas/address';
import { ParticipantSchema } from '../sharedSchemas/participant';
import { UserSchema } from '../sharedSchemas/user';

SimpleSchema.defineValidationErrorTransform(error => {
    const ddpError = new Meteor.Error(error.message);
    ddpError.error = 'validation-error';
    ddpError.details = error.details;
    return ddpError;
  });

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
    isTemplate: {
        type: Boolean,
        defaultValue: false,
        optional: true
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
    participants: {
        type: Array,
        optional: true
    },
    'participants.$': {
        type: ParticipantSchema,
        minCount: 0
    },
    // Gutachter 1 + 2
    expert1: {
        type: UserSchema,
        optional: true
    },
    expert2: {
        type: UserSchema,
        optional: true
    },
});

OpinionsSchema.extend(CreationSchema);
OpinionsSchema.extend(SharedWithSchema);

export const Opinions = new Mongo.Collection('opinions');
Opinions.attachSchema(OpinionsSchema);

