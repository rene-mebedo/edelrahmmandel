import React from 'react';
import {useDraggable} from '@dnd-kit/core';

export const Draggable = ( props ) => {
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: props.id,
  });
  
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}