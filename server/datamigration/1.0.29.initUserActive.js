import { Meteor } from 'meteor/meteor';
/*
    Initialisierung des neuen Feldes active in user.
    Da dieses Feld neu ist muss es initialisiert werden.
*/

console.log( 'start init user.active' );

const res = Meteor.users.update({
    $or: [
        { active: null },
        { active: { $exists: false } }
    ]
}, {
    $set: {
        active: true
    }
}, {
    multi: true
});

console.log( 'done init user.active' );
