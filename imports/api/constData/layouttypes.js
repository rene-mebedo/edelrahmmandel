import { actionCodes } from './actioncodes';

const LayouttypesObject = {
    HEADING: {
        _id: 'HEADING',
        title: 'Überschrift',
        description: 'Wird für die Hauptüberschriften verwandt',
        hasChilds: true,
        template: `
            <div id="{{_id}}" class="mbac-item-type-heading depth-{{depth}}">
                <div class="mbac-title">
                    <span class="mbac-position media-print">{{XparentPosition}}{{Xposition}}</span>
                    <span class="mbac-position media-screen">{{parentPosition}}{{position}}</span>
                    <span>{{printTitle}}</span>
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
                <div class="mbac-child-content">
                    {{childContent}}
                </div>
            </div>
        `
    },
    TEXT: {
        _id: 'TEXT',
        title: 'Text',
        description: 'Wird als einfacher Textoutput herangezogen und exakt so ausgegeben wie im HTML formatiert.',
        hasChilds: false,
        template: `<div class="mbac-item-type-text depth-{{depth}}">{{text}}</div>`
    },
    QUESTION: {
        _id: 'QUESTION',
        title: 'Frage',
        description: 'Wird als Frage mit handlungsbedarf genutzt.',
        hasChilds: true,
        template: `
            <div id="{{_id}}" class="mbac-item-type-question depth-{{depth}}">
                <div class="mbac-title">
                    {{parentPosition}}{{position}} {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
                <div class="mbac-child-content">
                    {{childContent}}
                </div>
            </div>
        `
    },
    ANSWER : {
        _id: 'ANSWER',
        title: 'Antwort',
        description: 'Wird als mögliche Antwort zu einer Frage genutzt.',
        hasChilds: true,
        template: `
            <div id="{{_id}}" class="mbac-item-type-answer depth-{{depth}}">
                <div class="mbac-title">
                    Antwort/Ist-Zustand
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
                <div class="mbac-child-content">
                    {{childContent}}
                </div>
                <div class="mbac-handlungsempfehlung {{actionCode}}">
                    <div class="mbac-action-title">
                        Handlungsempfehlung
                    </div>
                    <div class="mbac-action-text">
                        {{actionText}}
                    </div>
                    <div class="mbac-action-longtext">
                        {{actionCodeLongtext}}
                    </div>
                </div>
            </div>
        `
    },

    HINT: {
        _id: 'HINT',
        title: 'Hinweis',
        description: 'Hinweistext, der üblicherweise zu einer Antwort folgt',
        hasChilds: false,
        template: `
            <div id="{{_id}}" class="mbac-item-type-hint depth-{{depth}}">
                <div class="mbac-fix-title">
                    Hinweis
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },
    INFO: {
        _id: 'INFO',
        title: 'Info',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Information" verwandt.',
        hasChilds: false,
        template: `
            <div id="{{_id}}" class="mbac-item-type-info depth-{{depth}}">
                <div class="mbac-fix-title">
                    Information
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    IMPORTANT: {
        _id: 'IMPORTANT',
        title: 'Wichtig',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Wichtig" verwandt.',
        hasChilds: false,
        template: `
            <div id="{{_id}}" class="mbac-item-type-important depth-{{depth}}">
                <div class="mbac-fix-title">
                    Wichtig
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    RECOMMENDATION: {
        _id: 'RECOMMENDATION',
        title: 'Empfehlung',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Empfehlung" verwandt.',
        hasChilds: false,
        template: `
            <div id="{{_id}}" class="mbac-item-type-recommendation depth-{{depth}}">
                <div class="mbac-fix-title">
                    Empfehlung
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    /*NOTE: {
        _id: 'NOTE',
        title: 'Hinweis',
        description: 'Wird als allgemeine Info mit vorangestelltem Text "Hinweis" verwandt.',
        hasChilds: false,
        template: `
            <div class="mbac-item-type-note depth-{{depth}}">
                <div class="mbac-fix-title">
                    Empfehlung
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },*/

    REMARK: {
        _id: 'REMARK',
        title: 'Anmerkung',
        description: 'Wird als Anmerkung innerhalb einer Frage genutzt.',
        hasChilds: false,
        template: `
            <div id="{{_id}}" class="mbac-item-type-remark depth-{{depth}}">
                <div class="mbac-fix-title">
                    Anmerkung
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },

    /* wird in dem Gutachten von JK aktuell nicht mehr verwandt
    ATTENTION: {
        _id: 'ATTENTION',
        title: 'Achtung inkl. Bild',
        description: 'Wird als Wichtiger Hinweistext mit Stopsymbol verwandt.',
        hasChilds: false,
        template: `
            <div class="mbac-item-type-remark depth-{{depth}}">
                <div class="mbac-fix-title">
                    Anmerkung
                </div>
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>
            </div>
        `
    },*/
    /* Definitionen gibt es in dem Gutachten nur 2x und kann aber als Text zur Frage aufgenommen werden
    DEFINITION: {
        _id: 'DEFINITION',
        title: 'Definition',
        description: 'Wird als Begriffsdefinition verwandt.',
        hasChilds: false
    },*/

    BESTIMMUNGEN: {
        _id: 'BESTIMMUNGEN',
        title: 'Bestimmungen',
        description: 'Wird als Aufzählung für die zu beachtenden Vorschriften und Bestimmungen verwandt',
        hasChilds: false,
        template: `
            <table id="{{_id}}" class="mbac-item-type-bestimmungen">
                <thead>
                    <tr>
                        <td>{{printTitle}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {{text}}
                        </td>
                    </tr>
                </tbody>
            </table>
        `
    },

    TODOLIST: {
        _id: 'TODOLIST',
        title: 'Aufstellung Maßnahmen',
        description: 'Hier wird die Liste aller Maßnahmen aufgeführt.',
        hasChilds: false,
        template: `
            <div id="{{_id}}" class="mbac-item-type-todolist">
                <div class="mbac-print-title">
                    {{printTitle}}
                </div>
                <div class="mbac-text">
                    {{text}}
                </div>

                <table class="mbac-item-type-todolist">
                    <thead>
                        <tr>
                            <td>Lfd.Nr.</td>
                            <td>Maßnahme</td>
                        </tr>
                    </thead>
                    <tbody>
                        {{todoitems}}
                    </tbody>
                </table>
            </div>
        `
    },

    TODOITEM: {
        internalUseOnly: true,

        _id: 'TODOITEM',
        title: 'Einzelnes TODO Item',
        description: '',
        hasChilds: false,
        template: `
            <tr class="mbac-item-type-todolist-item">
                <td>{{index}}</td>
                <td>{{text}}</td>
            </tr>
        `
    },

    TODOITEMACTIONHEAD: {
        internalUseOnly: true,

        _id: 'TODOITEMACTIONHEAD',
        title: 'Überschrift der einzelnen Maßnahme',
        description: '',
        hasChilds: false,
        template: `
            <tr class="mbac-item-type-todolist-item-head {{actionCode}}">
                <td colspan="2">{{actionText}}</td>
            </tr>
        `
    },


    PICTURE: {
        _id: 'PICTURE',
        title: 'Bild(er)',
        description: 'Dieser Typ dient der Bilddokumentation und kann ein oder mehrer Bilder beinhalten',
        hasChilds: false,
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
export const layouttypesObject = LayouttypesObject;

/**
 * Render the given item by it's type and returns the generated HTML-code
 * 
 * @param {Object} item Specifies the current item to render with all props
 */
export const renderTemplate = (item, depth=0) => {
    const { template } = LayouttypesObject[item.type];

    const renderedTemplate = template
        .replace( /\{\{\_id\}\}/g, (item._id || '') + '' )
        .replace( /\{\{printTitle\}\}/g, item.printTitle || '')
        .replace( /\{\{text\}\}/g, item.text || '' )
        .replace( /\{\{actionCode\}\}/g, item.actionCode || '' )
        .replace( /\{\{actionCodeText\}\}/g, (item.actionCode && actionCodes[item.actionCode].text) || '' )
        .replace( /\{\{actionCodeLongtext\}\}/g, (item.actionCode && actionCodes[item.actionCode].longtext) || '' )
        .replace( /\{\{actionText\}\}/g, item.actionText || '' )
        .replace( /\{\{parentPosition\}\}/g, (item.parentPosition || '') + '' )
        .replace( /\{\{position\}\}/g, (item.position || '') + '' )
        .replace( /\{\{depth\}\}/g, depth + '' )
        

    return '<div class="mbac-opinion-detail">' + renderedTemplate + '</div>';
    //return <div className="mbac-opinion-detail" dangerouslySetInnerHTML={ {__html: renderedTemplate}} />
}