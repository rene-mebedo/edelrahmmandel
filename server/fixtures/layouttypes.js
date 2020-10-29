import { Layouttypes } from '/imports/api/collections/layouttypes';

if (Layouttypes.find().count() != 0) {
    Layouttypes.remove({});

    const types = [
        {
            _id: 'HEADING',
            title: 'Überschrift',
            description: 'Wird für die Hauptüberschriften verwandt',
            hasChilds: true
        },
        {
            _id: 'QUESTION',
            title: 'Frage',
            description: 'Wird als Frage mit handlungsbedarf genutzt.',
            hasChilds: true
        },
        {
            _id: 'ANSWER',
            title: 'Antwort',
            description: 'Wird als mögliche Antwort zu einer Frage genutzt.',
            hasChilds: false
        },
        {
            _id: 'INFO',
            title: 'Info',
            description: 'Wird als allgemeine Info innerhalb einer Frage genutzt.',
            hasChilds: false
        },
        {
            _id: 'REMARK',
            title: 'Anmerkung',
            description: 'Wird als Anmerkung innerhalb einer Frage genutzt.',
            hasChilds: false
        },
    ];

    types.forEach( t => {
        Layouttypes.insert(t);
    });
}