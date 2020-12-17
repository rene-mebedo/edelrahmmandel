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
    },
    opinionTitle: {
        type: String,
        label: 'Titel des Gutachters',
        optional: true
    }
});

export const UserWithRoleSchema = new SimpleSchema({
    user: {
        type: UserSchema,
        label: 'Benutzer'
    },
    role: {
        type: String,
        label: 'Benutzerrolle',
        optional: true
    }
});

export const CreationSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        label: 'Erstellt am',
        defaultValue: new Date
    },
    createdBy: {
        type: UserSchema,
        label: 'Erstellt von'
    },
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
