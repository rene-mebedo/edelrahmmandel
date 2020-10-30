export const layouttypesObject = {
    HEADING: {
        _id: 'HEADING',
        title: 'Überschrift',
        description: 'Wird für die Hauptüberschriften verwandt',
        hasChilds: true
    },
    QUESTION: {
        _id: 'QUESTION',
        title: 'Frage',
        description: 'Wird als Frage mit handlungsbedarf genutzt.',
        hasChilds: true
    },
    ANSWER : {
        _id: 'ANSWER',
        title: 'Antwort',
        description: 'Wird als mögliche Antwort zu einer Frage genutzt.',
        hasChilds: false
    },
    INFO: {
        _id: 'INFO',
        title: 'Info',
        description: 'Wird als allgemeine Info innerhalb einer Frage genutzt.',
        hasChilds: false
    },
    REMARK: {
        _id: 'REMARK',
        title: 'Anmerkung',
        description: 'Wird als Anmerkung innerhalb einer Frage genutzt.',
        hasChilds: false
    },
}
