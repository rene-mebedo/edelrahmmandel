import React, { Fragment , useState } from 'react';

//import { PictureSortable } from './PictureSortable';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';

//import {Draggable} from './Draggable';

import Modal from 'antd/lib/modal';

export const ListOpinionDetails_ModalSort = ({ pictures }) => {
    const [activeId, setActiveId] = useState(null);
    const [items, setItems] = useState( pictures );
    /*const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates
        })
    );*/

    const handleDragStart = ( event ) => {
        const {active} = event;
        
        setActiveId(active.id);
    }

    const handleDragEnd = ( event ) => {
        const {active, over} = event;
        if ( active.id !== over.id ) {
            setItems( ( items ) => {
                const oldElem = items.find( ( elem ) => {return elem._id == active.id} );
                const newElem = items.find( ( elem ) => {return elem._id == over.id} );

                const oldIndex = items.indexOf(oldElem);
                const newIndex = items.indexOf(newElem);

                //pictures = arrayMove( items , oldIndex , newIndex );

                // Hier auch DB Änderungen durchführen?!
                Meteor.call( 'opinionDetails.rePosition', active.id, newIndex+1 , (err, res) => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                        });
                    }
                });
                
                return pictures;
            });
        }
        setActiveId(null);
    }

    const handleDragMove = ( event ) => {
        const {active, over} = event;
        if ( active.id !== over.id ) {
            setItems( ( items ) => {
                const oldElem = items.find( ( elem ) => {return elem._id == active.id} );
                const newElem = items.find( ( elem ) => {return elem._id == over.id} );

                const oldIndex = items.indexOf(oldElem);
                const newIndex = items.indexOf(newElem);

                //pictures = arrayMove( items , oldIndex , newIndex );

                // Hier auch DB Änderungen durchführen?!
                Meteor.call( 'opinionDetails.rePosition', active.id, newIndex+1 , (err, res) => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein interner Fehler aufgetreten. ' + err.message
                        });
                    }
                });
                
                return pictures;
            });
        }
    }
    
    return (
        /*<DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
        >
            <SortableContext 
                items={items}
                strategy={verticalListSortingStrategy}
            >
                <Fragment>
                <div id={detail._id}>
                    { items.map( (detail) =>
                        123
                    )}
                </div>
                </Fragment>
            </SortableContext>
            <DragOverlay>
                
            </DragOverlay>
        </DndContext>*/
        123
    )
};

//<PictureSortable id={detail._id} detail={detail} />

//{activeId ? <PictureSortable id={activeId} detail={items.find( ( elem ) => { return elem._id == activeId } )} /> : null}