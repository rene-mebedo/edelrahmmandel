import { Opinions } from '/imports/api/collections/opinions';
/*
    Initialisierung des neuen Feldes outputTemplate zur Steuerung des Ausgabeformats beim Drucken einer PDF-Datei
    Da diesese Feld neu ist muss es initialisiert werden, so dass das bisherige Verfahren sichergestellt ist.
*/

console.log( 'start init opinion.outputTempate' );

const res = Opinions.update({
    $or: [
        { outputTemplate: null },
        { outputTemplate: { $exists: false } }
    ]
}, {
    $set: {
        outputTemplate: 'mebedo-gutachten'
    }
}, {
    multi: true
});

console.log( 'done init opinion.outputTempate.' );
