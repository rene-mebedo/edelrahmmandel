import { Meteor } from 'meteor/meteor';
import { Opinions } from '/imports/api/collections/opinions';

Meteor.publish('opinions', function publishOpinions() {
    //Meteor._sleepForMs(2000);
    return Opinions.find({
        "sharedWith.user.userId": this.userId
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

*/