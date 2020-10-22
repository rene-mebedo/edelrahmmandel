import SimpleSchema from 'simpl-schema';

export const UserSchema = new SimpleSchema({
    userId: {
        type: String,
        label: 'Benutzer-ID'
    },
    firstName: {
        type: String,
        max: 100,
        label: 'Vorname'
    },
    lastName: {
        type: String,
        max: 100,
        label: 'Nachname'
    }
});

export const UserWithRoleSchema = new SimpleSchema({
    user: {
        type: UserSchema,
        label: 'Benutzer'
    },
    role: {
        type: String,
        optional: true,
        label: 'Benutzerrolle'
    }
});

export const SharedWithSchema = new SimpleSchema({
    sharedWith: {
        type: Array,
        label: 'Geteilt mit'
    },
    "sharedWith.$": {
        type: UserWithRoleSchema
    }
});