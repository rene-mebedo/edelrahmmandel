export const layouttypesObject = {
    HEADING: {
        _id: 'HEADING',
        title: 'Überschrift',
        description: 'Wird für die Hauptüberschriften verwandt',
        hasChilds: true,
        /*template: {
            1: `<H1>{{title}}</h1>`,
            2: `<H2>{{title}}</h2>`
        }*/
    },
    TEXT: {
        _id: 'TEXT',
        title: 'Text',
        description: 'Wird als einfacher Textoutput herangezogen und exakt so ausgegeben wie im HTML formatiert.',
        hasChilds: false,
        //template: `<div>{{text}}</div>`
    },
    QUESTION: {
        _id: 'QUESTION',
        title: 'Frage',
        description: 'Wird als Frage mit handlungsbedarf genutzt.',
        hasChilds: true,
        /*template: {
            1: `
            <H2>{{title}}</h1>
            <div>{{text}}</div>
            
            `,
            2: `<H3>{{title}}</h3>`
        }*/
    },
    ANSWER : {
        _id: 'ANSWER',
        title: 'Antwort',
        description: 'Wird als mögliche Antwort zu einer Frage genutzt.',
        hasChilds: false,
        /*template: {
            1: `
            <div style="width:100%;">
                <td>
                    {{actionCode_small}}    
                    <img src="..." width=100 heigh=200>
                </td>
                <td>
                    {{text}}
                </td>
            </div>
        `,
            2: `
            
            `
        }*/
    },
    DEFINITION: {
        _id: 'DEFINITION',
        title: 'Definition',
        description: 'Wird als Begriffsdefinition verwandt.',
        hasChilds: false
        /*template: `
            <div style="width:100%;">
                <p>
                    <b><u>{{title}}</u></b>
                </p>
                <p>{{text}}</p>
            </div>
        `,
            2: `
            
            `
        }*/
    },

    INFO: {
        _id: 'INFO',
        title: 'Info',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Information" verwandt.',
        hasChilds: false
    },

    RECOMMENDATION: {
        _id: 'RECOMMENDATION',
        title: 'Empfehlung',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Empfehlung" verwandt.',
        hasChilds: false
    },

    IMPORTANT: {
        _id: 'IMPORTANT',
        title: 'Wichtig',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Wichtig" verwandt.',
        hasChilds: false
    },

    NOTE: {
        _id: 'NOTE',
        title: 'Wichtig',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Hinweis" verwandt.',
        hasChilds: false
    },

    REMARK: {
        _id: 'REMARK',
        title: 'Anmerkung',
        description: 'Wird als Anmerkung innerhalb einer Frage genutzt.',
        hasChilds: false
    },

    ATTENTION: {
        _id: 'ATTENTION',
        title: 'Achtung inkl. Bild',
        description: 'Wird als Wichtiger Hinweistext mit Stopsymbol verwandt.',
        hasChilds: false,
        /*template: `
            <div style="width:100%;">
                <td>
                    <img src="..." width=100 heigh=200>
                </td>
                <td color="red">
                    {{text}}
                </td>
            </div>
        `
        }*/
    },

    BESTIMMUNGEN: {
        _id: 'BESTIMMUNGEN',
        title: 'Bestimmungen',
        description: 'Wird als Wichtiger Hinweistext mit Stopsymbol verwandt.',
        hasChilds: false,
        /*template: `
            <div style="width:100%; bgcolor:orange">
                Einzuhaltende Bestimmungen
                {{text}}
            </div>
        `
        }*/
    },

    TODOLIST: {
        _id: 'TODOLIST',
        title: 'Aufstellung Maßnahmen',
        description: 'Hier wird die Liste aller Maßnahmen aufgeführt.',
        hasChilds: false,
        /*template: `
            <div style="width:100%; bgcolor:orange">
                {{title}}
                {{text}}

                {{todolist}}
            </div>
        `
        }*/
    },

    UNKNOWN: {
        _id: 'UNKNOWN',
        title: '<nicht festgelegt>',
        description: 'Dies sollte nicht vorkommen',
        hasChilds: false,
        /*template: `
            <div style="width:100%; bgcolor:orange">
                {{title}}
                {{text}}

                {{todolist}}
            </div>
        `
        }*/
    }

}
