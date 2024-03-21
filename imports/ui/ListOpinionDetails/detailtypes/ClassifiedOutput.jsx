import React, { Fragment } from 'react';
import { OpinionDetailAdder } from './OpinionDetailAdder';

import { EditableContent } from '../../components/EditableContent';

export const ClassifiedOutput = ( { item, permissions, first, last } ) => {
    const { _id, depth, printTitle, text, deleted } = item;
    const { classType, header } = {
        HINT: { classType: 'hint', header: 'Hinweis' },
        INFO: { classType: 'info', header: 'Information' },
        IMPORTANT: { classType: 'important', header: 'Wichtig' },
        RECOMMENDATION: { classType: 'recommendation', header: 'Empfehlung' },
        NOTE: { classType: 'note', header: 'Hinweis' },
        REMARK: { classType: 'remark', header: 'Anmerkung' },
        ATTENTION: { classType: 'attention', header: 'Achtung' },
        DEFINITION: { classType: 'definition', header: 'Definition' },
    }[item.type];
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';
    // Bei Elementen auf erster Ebene wird Info angezeigt.
    const isFirstPosition = (depth == 1);

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                {isFirstPosition ? <span>[Info: Dieses Element wurde auf der ersten Ebene angelegt, ist das so gewollt? Dieser Text innerhalb [] wird in der (PDF) Ausgabe nicht angezeigt.]</span> : null}
                <div id={_id} className={`mbac-item-type-${classType} depth-${depth}`}>
                    <div className="mbac-fix-title">
                        {header}
                    </div>
                    {/*<div className="mbac-print-title">
                        <EditableContent type="span" 
                            value={printTitle}
                            field="printTitle"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                        </div>*/
                    }
                    <div className="mbac-text">
                        <EditableContent type="wysiwyg" 
                            value={text}
                            field="text"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                    </div>
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}