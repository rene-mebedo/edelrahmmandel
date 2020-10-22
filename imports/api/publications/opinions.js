import { Meteor } from 'meteor/meteor';
import { OpinionsCollection } from '/imports/api/opinions';

Meteor.publish('opinions', function publishOpinions() {
    //Meteor._sleepForMs(2000);
    return OpinionsCollection.find({
        "sharedWith.userId": this.userId
    });
});

/*
var opinion = {
    titel: "Gutachten Daimler Benz vom 28.10.2020",
    sharedWith: [ { user:"rene", role: "owner" }, { user:"marc", role: "externer" } ]
}

Users:

Rene = { userid: "rene", roles: [ "admin", "mitarbeiter"] }
Marc = { userid: "marc", roles: [ "jeder", "mitarbeiter", "admin" ] }
engie = { userid: "engie", roles: [ "externer" ] }

michael = { userid: "michael", roles: [ "mitarbeiter" ] }

mrX = { }

Rollenmanagement:

Owner=
{
    _id: 'OWNER',
    rolename: 'Ersteller/Besitzer',
    score: 200,
    description: 'Der Benutzer, der das Gutachten erstellt hat',
    permissions: {
        opinion: {
            create: false,
            edit: true,
            remove: true,
            admin: true
        },
        shareWith: true,
        cancelShare: true
    }
}

Owner=
{
    _id: 'Co-OWNER',
    rolename: 'Ersteller/Besitzer',
    score: 210,
    description: 'Der Benutzer, der das Gutachten erstellt hat',
    permissions: {
        systemAdmin: false,
        opinion: {
            create: false,
            edit: true,
            remove: true,
            admin: true
        },
        shareWith: true,
        cancelShare: true
    }
}

Mitarbeiter=
{
    _id: 'EMPLOYEE',
    rolename: 'Mitarbeiter',
    score: 200,
    description: 'Zugriff nur für Mitarbeiter',
    permissions: {
        opinion: {
            create: true,
            edit: true,
            remove: true,
            admin: false
        },
        shareWith: true,
        cancelShare: false
    }
}

Everybody=
{
    permissions: {
        opinion: {
            create: false,
            edit: false,
            remove: false
        },
        shareWith: false
    }
}

external=
{
    permissions: {
        opinion: {
            create: false,
            edit: false,
            remove: false
        },
        shareWith: true
    }
}

*/