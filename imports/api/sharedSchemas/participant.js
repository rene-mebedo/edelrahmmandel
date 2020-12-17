import SimpleSchema from 'simpl-schema';

export const ParticipantSchema = new SimpleSchema({
    gender: {
        type: String,
        label: 'Anrede',
        allowedValues: ['Herr', 'Frau', 'Divers']
    },
    academicTitle: {
        type: String,
        label: 'Titel',
        optional: true
    },
    firstName: {
        type: String,
        label: 'Vorname',
        optional: true
    },
    lastName: {
        type: String,
        label: 'Nachname'
    },
    comment: {
        type: String,
        label: 'Kommentar',
        optional: true
    }
});