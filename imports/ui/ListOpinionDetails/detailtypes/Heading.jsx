import React, {Fragment, useState, useEffect, useRef} from 'react';
import { ListOpinionDetailsLinkable } from '../ListOpinionDetails';
import { OpinionDetailAdder } from './OpinionDetailAdder';

import {
    RightCircleOutlined,
    PlusSquareOutlined,
    MinusSquareOutlined,
} from '@ant-design/icons';

import { EditableContent } from '../../components/EditableContent';
import { AppState } from '../../../client/AppState';
import { Link } from '../../components/Link';
import { Space } from 'antd';

export const Heading = ( { item, permissions, first, last } ) => {
    const [collapsed, setCollapsed] = useState(true);
    let { _id, depth, printTitle, deleted, parentPosition, position } = item;
    const deletedClass = deleted ? 'mbac-opinion-detail-deleted':'';

    if (!parentPosition) position += '.';

    return (
        <Fragment>
            <OpinionDetailAdder item={item} permissions={permissions} />
            <div className={`mbac-opinion-detail depth-${depth} ${deletedClass}`}>
                <div id={item._id} className={`mbac-item-type-heading depth-${depth}`}>
                    <div className="mbac-title">
                        <Space>
                            { collapsed ? <PlusSquareOutlined onClick={e=>setCollapsed(!collapsed)}/> : <MinusSquareOutlined onClick={e=>setCollapsed(!collapsed)}/> }
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
                        </Space>
                    </div>

                    { collapsed || deleted ? null : 
                        <div className="mbac-child-content">
                            <ListOpinionDetailsLinkable 
                                refOpinion={item.refOpinion}
                                refParentDetail={item._id}
                                canEdit={permissions.canEdit}
                                canDelete={permissions.canDelete}
                                currentUser={permissions.currentUser}
                            />
                        </div>
                    }
                </div>
            </div>
            { !last ? null : <OpinionDetailAdder after item={item} permissions={permissions} /> }
        </Fragment>
    )
}