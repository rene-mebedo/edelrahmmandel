import { OpinionDetails } from '/imports/api/collections/opinionDetails';

/* MT, 04.11.2021
Die am 27.5.2021 durchgeführten Änderungen an layouttypes.js, durch die bei einigen opinionDetails Typen keine
printTitle mehr verwendet werden, führten zu Folgeproblemen:
Es gab bereits angelegte opinionDetails der entsprechenden Typen, bei denen printTitle gefüllt war.
=> Dies führt zu Abweichungen in der PDF Ausgabe (inkl. printTitle) und der Eingabe (ohne printTitle).

Hier wird dieses Problem behoben, in dem für alle opinionDetails der entsprechenden Typen, bei denen in printTitle
Text eingetragen ist, dieser Inhalt an den Anfang des Text kopiert wird und im Anschluss printTitle auf '' gesetzt wird.
Dies wird für alle Gutachten durchgeführt mit Ausnahme des bereits fertigen Gutachtens für DMK (Nr. 2021-0037, ID: fE2ZPw3xJBh4NS4kb).

Es geht um opinionDetails der folgenden Typen:
- HINT
- INFO
- IMPORTANT
- RECOMMENDATION
- NOTE
- REMARK
- ATTENTION
- DEFINITION
*/

const changeOpinionDetail = ( id , iText , iPrintTitle ) => {
    iText = iPrintTitle + iText;
    OpinionDetails.update({
        _id: id
    }, {
        $set: {
            text: iText ,
            printTitle: null
        }
    });
    
    console.log( 'done for id ' , id );
}

console.log( 'start printTitle correction' );
OpinionDetails.find({
    $and: [
        {
            //MbSukX9gxYHDyZCoH
            refOpinion: {$ne: 'fE2ZPw3xJBh4NS4kb'}// Alle opinionDetails, außer die aus dem DMK Gutachten.
        },
        {
            $or: [
                { type: 'HINT' },
                { type: 'INFO' },
                { type: 'IMPORTANT' },
                { type: 'RECOMMENDATION' },
                { type: 'NOTE' },
                { type: 'REMARK' },
                { type: 'ATTENTION' },
                { type: 'DEFINITION' }
            ]
        },
        {
            printTitle: {$ne: null}
        }
    ]
}, { fields: { _id: 1 , text: 1 , printTitle: 1 }}).fetch().forEach( od => {
    changeOpinionDetail( od._id , od.text , od.printTitle );
});

console.log( 'done printTitle correction' );

//--------------

/*const checkChildrenRecursive = (id, by, property, propertyBy) => {
    OpinionDetails.find({
        $and: [
            { refParentDetail: id },
            { 
                $or: [
                    { [property]: false },
                    { [property]: { $exists: false } }
                ]
            }
        ]
    }, { fields: { _id: 1 }}).fetch().map( detail => detail._id ).forEach( id => {
        checkChildrenRecursive(id, by, property, propertyBy)

        OpinionDetails.update({
            _id: id
        }, {
            $set: {
                [property]: true,
                [propertyBy]: by
            }
        })
        
        console.log(property, 'Property must set to True for', id, 'by', by)
    });
}

console.log('check OpinionDetails collection > deleted property recursive...');

OpinionDetails.find({
    deleted: true
}, { fields: { _id: 1 }}).fetch().map( detail => detail._id ).forEach( id => {
    checkChildrenRecursive(id, id, 'deleted', 'deletedBy')
});
console.log('Done.');

console.log('check OpinionDetails collection > finallyRemoved property recursive...');

OpinionDetails.find({
    finallyRemoved: true
}, { fields: { _id: 1 }}).fetch().map( detail => detail._id ).forEach( id => {
    checkChildrenRecursive(id, id, 'finallyRemoved', 'finallyRemovedBy')
});
console.log('Done.');*/
