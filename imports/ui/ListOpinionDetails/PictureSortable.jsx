import React from 'react';
import {useSortable} from '@dnd-kit/sortable';

import { ListImages_ModalSort } from '../ListImages_ModalSort';

import Col from 'antd/lib/col';
import Row from 'antd/lib/row';

import { ReadPicTextContent } from '../components/ReadPicTextContent';

export const PictureSortable = ( { id , detail } ) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: id});
      
      const style = {};//{transform: 'translate3d(30px, 30px, 0)'};
      
      return (
        <div className={"ListImages_ModalSort"} ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Row gutter={[16,16]}>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <ListImages_ModalSort imageOrImages={detail.files} ref={setNodeRef} style={style} {...attributes} {...listeners} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={16} xl={16}>
                    <div className="mbac-title" >
                        {detail.printTitle}
                    </div>
                    
                    <div className="mbac-text" >
                        <ReadPicTextContent
                            value={detail.text}
                        />
                    </div>
                </Col>
            </Row>
        </div>
      );
};