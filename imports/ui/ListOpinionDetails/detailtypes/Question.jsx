import React, {Fragment, useState, useEffect, useRef} from 'react';
import { ListOpinionDetailsLinkable } from '../ListOpinionDetails';
import { OpinionDetailAdder } from './OpinionDetailAdder';

import {
    RightCircleOutlined
} from '@ant-design/icons';

import { EditableContent } from '../../components/EditableContent';
import { AppState } from '../../../client/AppState';
import { Link } from '../../components/Link';

export const Question = ( { item, permissions, first, last } ) => {
    let { _id, depth, printTitle, text, deleted, parentPosition, position } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';

    if (!parentPosition) position += '.';

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={_id} className={`mbac-item-type-question depth-${depth}`}>
                    <div className="mbac-title">
                        <span className="mbac-position mbac-media-screen">{parentPosition}{position}</span>
                        <EditableContent type="span" 
                            value={printTitle}
                            field="printTitle"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                        <Link canCancel href={`/opinions/${item.refOpinion}/${item._id}`}>
                            <RightCircleOutlined />
                        </Link>
                    </div>
                    <div className="mbac-text">
                        <EditableContent type="wysiwyg" 
                            value={text}
                            field="text"
                            refDetail={_id}
                            item={item}
                            permissions={permissions}
                        />
                    </div>
        
                    { /*<OpinionDetailAdder pseudoItem={{refOpinion: item.refOpinion, refParentDetail: item._id, depth: item.depth + 1}} permissions={permissions} /> */ }
                    <div className="mbac-child-content">
                        <ListOpinionDetailsLinkable 
                            refOpinion={item.refOpinion}
                            refParentDetail={item._id}
                            canEdit={permissions.canEdit}
                            canDelete={permissions.canDelete}
                            currentUser={permissions.currentUser}
                        />
                    </div>
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}