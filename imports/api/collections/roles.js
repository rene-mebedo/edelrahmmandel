import { Mongo } from 'meteor/mongo';
import SimpleSchema from  'simpl-schema';

export const RolesSchema = new SimpleSchema({
    rolename: {
        type: String,
        label: 'Rollenname'
    },
    description: {
        type: String,
        label: 'Beschreibung'
    },
    selectable: {
        type: Boolean,
        label: 'Auswählbar durch Benutzer',
        defaultValue: true
    },
    permissions: {
        type: new SimpleSchema({
            opinion: {
                type: new SimpleSchema({
                    create: { type: SimpleSchema.Integer, label: 'Gutachten Erstellen', defaultValue: 0 },
                    edit: { type: SimpleSchema.Integer, label: 'Gutachten Editieren', defaultValue: 0 },
                    remove: { type: SimpleSchema.Integer, label: 'Gutachten Löschen', defaultValue: 0 },
                    admin: { type: SimpleSchema.Integer, label: 'Gutachten Administrator ???', defaultValue: 0 },
                    manageTemplate: { type: SimpleSchema.Integer, label: 'Gutachten Vorlage erstellen, bearbeiten ???', defaultValue: 0 },
                    // zum Löschen einer Vorlage benötigt der benutzer die remove Berechtigung UND manageTemplate Berechtigung
                }),
                label: 'Berechtigungen für Gutachten'
            },
            shareWith: {
                type: SimpleSchema.Integer,
                label: 'Darf Dinge teilen',
                defaultValue: 0
            },
            cancelSharedWith: {
                type: SimpleSchema.Integer,
                label: 'Darf Teilen rückgängig machen bzw. eine Person "entfernen"',
                defaultValue: 0
            },
            manageUsersAndRoles: {
                type: SimpleSchema.Integer,
                label: 'Darf Benutzer und Rollen verwalten',
                defaultValue: 0
            },
        }),
        label: 'Berechtigungen'
    }
});

export const Roles = new Mongo.Collection('roles');
Roles.attachSchema(RolesSchema);