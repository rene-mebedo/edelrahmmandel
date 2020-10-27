import { Roles } from '/imports/api/collections/roles';

if (Roles.find().count() != 1) {
    Roles.remove({});

    Roles.insert({
        _id: 'EVERYBODY',
        rolename: 'Jeder',
        score: 0,
        description: 'Zugriff für jeden Benutzer',
        permissions: {
            opinion: {                
                create: 0,
                edit: 0,
                remove: 0,
                admin: 0
            },
            shareWith: 0,
            cancelSharedWith: 0,
            cancelOwnSharedWith: 0,
            manageOpinionTemplate: 0,
        },
        selectable: true
    });

    Roles.insert({
        _id: 'EXTERNAL',
        rolename: 'Externer',
        score: 100,
        description: 'Zugriff nur für externe - Kunden, Projektleiter, etc.',
        permissions: {
            opinion: {                
                create: 0,
                edit: 0,
                remove: 0,
                admin: 0
            },
            shareWith: 1,
            cancelSharedWith: 0,
            cancelOwnSharedWith: 0,
            manageOpinionTemplate: 0,
        },
        selectable: true
    });

    Roles.insert({
        _id: 'EMPLOYEE',
        rolename: 'Mitarbeiter',
        score: 200,
        description: 'Zugriff nur für Mitarbeiter',
        permissions: {
            opinion: {                
                create: 1,
                edit: 1,
                remove: 0,
                admin: 0
            },
            shareWith: 1,
            cancelSharedWith: 0,
            cancelOwnSharedWith: 1,
            manageOpinionTemplate: 0,
        },
        selectable: true
    });

    Roles.insert({
        _id: 'OWNER',
        rolename: 'Besitzer, Ersteller',
        score: 800,
        description: 'Benutzer, der das Dokument erstellt hat',
        permissions: {
            opinion: {
                create: 0,
                edit: 1,
                remove: 1,
                admin: 0
            },
            shareWith: 1,
            cancelSharedWith: 1,
            cancelOwnSharedWith: 1,
            manageOpinionTemplate: 0,
        },
        selectable: false
    });

    Roles.insert({
        _id: 'ADMIN',
        rolename: 'Administrator',
        score: 99999,
        description: 'Admin darf alles',
        permissions: {
            opinion: {                
                create: 1,
                edit: 1,
                remove: 1,
                admin: 1
            },
            shareWith: 1,
            cancelSharedWith: 1,
            cancelOwnSharedWith: 1,
            manageOpinionTemplate: 0,
        },
        selectable: true
    });
}