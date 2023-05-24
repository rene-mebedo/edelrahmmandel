import React from 'react';
import {useSortable} from '@dnd-kit/sortable';

import { Heading } from './detailtypes/Heading';
import { Text } from './detailtypes/Text';
import { Bestimmungen } from './detailtypes/Bestimmungen';
import { Question } from './detailtypes/Question';
import { Answer } from './detailtypes/Answer';
import { ClassifiedOutput } from './detailtypes/ClassifiedOutput';
import { Pagebreak } from './detailtypes/Pagebreak';
import { Picture } from './detailtypes/Picture';
import { PictureContainer } from './detailtypes/PictureContainer';
import { ActionTodoList } from '../components/ActionTodoList';

export const ListOpinionDetails_SortableItem = ( { key, id, item, permissions, first, last, refOpinion } ) => {
    const props = {
        key,
        id,
        item, 
        permissions,
        first,
        last,
        refOpinion
    }
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id});

    const style = {
        transform: 'translate3d(100px, 100px, 0)'
    };

    /*return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {
                item.type == 'HEADING' ? <Heading {...props} /> : 
                item.type == 'TEXT' ? <Text {...props} /> :
                item.type == 'QUESTION' ? <Question {...props} /> :
                item.type == 'ANSWER' ? <Answer {...props} /> :
                item.type == 'BESTIMMUNGEN' ? <Bestimmungen {...props} /> :
                item.type == 'PICTURE' ? <Picture {...props} /> :
                item.type == 'PICTURECONTAINER' ? <PictureContainer {...props} /> :
                item.type == 'PAGEBREAK' ? <Pagebreak {...props} /> :
                item.type == 'TODOLIST' ? <ActionTodoList {...props} /> :
                <ClassifiedOutput {...props} />
            }
        </div>
    );*/
    return (
        <div>
        {
            item.type == 'HEADING' ? <Heading ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> : 
            item.type == 'TEXT' ? <Text ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> :
            item.type == 'QUESTION' ? <Question ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> :
            item.type == 'ANSWER' ? <Answer ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> :
            item.type == 'BESTIMMUNGEN' ? <Bestimmungen ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> :
            item.type == 'PICTURE' ? <Picture ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> :
            item.type == 'PICTURECONTAINER' ? <PictureContainer ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> :
            item.type == 'PAGEBREAK' ? <Pagebreak ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> :
            item.type == 'TODOLIST' ? <ActionTodoList ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} /> :
            <ClassifiedOutput ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} />
        }
        </div>
    );
    
    /*console.log( item.type );
        return <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Heading {...props} />
        </div>;
    if (item.type == 'HEADING') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Heading {...props} />
        </div>)
    }
    else if (item.type == 'TEXT') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Text {...props} />
        </div>);
    }
    else if (item.type == 'QUESTION') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Question {...props} />
        </div>);
    }
    else if (item.type == 'ANSWER') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Answer {...props} />
        </div>);
    }
    else if (item.type == 'BESTIMMUNGEN') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Bestimmungen {...props} />
        </div>);
    }
    else if (item.type == 'PICTURE') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Picture {...props} />
        </div>);
    }
    else if (item.type == 'PICTURECONTAINER') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <PictureContainer {...props} />
        </div>);
    }
    else if (item.type == 'PAGEBREAK') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Pagebreak {...props} />
        </div>);
    }
    else if (item.type == 'TODOLIST') {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ActionTodoList {...props} />
        </div>);
    }
    else {
        return
        (<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ClassifiedOutput {...props} />
        </div>);
    }*/
    //return <ClassifiedOutput {...props} />;
};