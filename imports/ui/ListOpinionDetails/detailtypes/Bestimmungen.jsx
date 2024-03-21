import React, { Fragment } from 'react';
import { EditableContent } from '../../components/EditableContent';
import { OpinionDetailAdder } from './OpinionDetailAdder';

export const Bestimmungen = ( { item, permissions, first, last } ) => {
    let { _id, depth, printTitle, text, deleted } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';
    // Bei Elementen auf erster Ebene wird Info angezeigt.
    const isFirstPosition = (depth == 1);

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                {isFirstPosition ? <span>[Info: Dieses Element wurde auf der ersten Ebene angelegt, ist das so gewollt? Dieser Text innerhalb [] wird in der (PDF) Ausgabe nicht angezeigt.]</span> : null}
                <div id={_id} className={`mbac-item-type-bestimmungen depth-${depth}`}>
                    <table>
                        <thead>
                            <tr>
                                <td>
                                    <EditableContent type="span" 
                                        value={printTitle}
                                        field="printTitle"
                                        refDetail={_id}
                                        item={item}
                                        permissions={permissions}
                                    />
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <EditableContent type="wysiwyg" 
                                        value={text}
                                        field="text"
                                        refDetail={_id}
                                        item={item}
                                        permissions={permissions}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}