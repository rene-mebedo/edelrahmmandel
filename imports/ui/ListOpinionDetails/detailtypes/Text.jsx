import React, { Fragment } from 'react';

import { EditableContent } from '../../components/EditableContent';
import { OpinionDetailAdder } from './OpinionDetailAdder';

export const Text = ( { item, permissions, first, last } ) => {
    const { _id, depth, text, deleted } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';
    // Bei Textelementen auf erster Ebene wird Info angezeigt.
    const isFirstPosition = (depth == 1);

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={_id} className={`mbac-item-type-text depth-${depth}`}>
                    <div className="mbac-text" >
                        {isFirstPosition ? <span>[Info: Dieses Textelement wurde auf der ersten Ebene angelegt, ist das so gewollt? Dieser Text innerhalb [] wird in der (PDF) Ausgabe nicht angezeigt.]</span> : null}                        
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