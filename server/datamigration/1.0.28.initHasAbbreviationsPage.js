import { Opinions } from '/imports/api/collections/opinions';
/*
    Initialisierung des neuen Feldes hasAbbreviationsPage zur Steuerung, ob das Abkürzungsverzeichnis in der Ausgabe enthalten sein soll.
    Da dieses Feld neu ist muss es initialisiert werden, so dass das bisherige Verfahren sichergestellt ist.
*/

console.log( 'start init opinion.hasAbbreviationsPage' );

const res = Opinions.update({
    $or: [
        { hasAbbreviationsPage: null },
        { hasAbbreviationsPage: { $exists: false } }
    ]
}, {
    $set: {
        hasAbbreviationsPage: true
    }
}, {
    multi: true
});

console.log( 'done init opinion.hasAbbreviationsPage.' );
