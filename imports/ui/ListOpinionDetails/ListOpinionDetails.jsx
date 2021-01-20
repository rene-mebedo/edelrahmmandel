import React, {Fragment, useState} from 'react';

import { useOpinionDetails } from '../../client/trackers';
import { Heading } from './detailtypes/Heading';
import { Text } from './detailtypes/Text';
import { Bestimmungen } from './detailtypes/Bestimmungen';
import { OpinionDetailAdder } from './detailtypes/OpinionDetailAdder';
import { Question } from './detailtypes/Question';
import { Answer } from './detailtypes/Answer';
import { ClassifiedOutput } from './detailtypes/ClassifiedOutput';
import { Pagebreak } from './detailtypes/Pagebreak';
import { Picture } from './detailtypes/Picture';

export const ListOpinionDetailsLinkable = ({ refOpinion, refParentDetail, depth = 1, canEdit=false, canDelete=false, currentUser }) => {
    const [ opinionDetails, isLoading ] = useOpinionDetails(refOpinion, refParentDetail);
    const permissions = { canEdit, canDelete, currentUser };

    if (isLoading) return null;
    
    const maxItems = opinionDetails.length;

    if (maxItems == 0 && canEdit) {
        return <OpinionDetailAdder pseudoItem={{refOpinion, refParentDetail, depth: depth + 1}} permissions={permissions} />
    }

    return opinionDetails.map( (detail, index) => {
        const props = {
            key: detail._id,
            item: detail, 
            permissions,
            first: (index===0),
            last: (maxItems===index+1)
        }
        if (detail.type == 'HEADING') return <Heading {...props} />;
        if (detail.type == 'TEXT') return <Text {...props} />;
        if (detail.type == 'QUESTION') return <Question {...props} />;
        if (detail.type == 'ANSWER') return <Answer {...props} />;
        if (detail.type == 'BESTIMMUNGEN') return <Bestimmungen {...props} />;
        if (detail.type == 'PICTURE') return <Picture {...props} />;
        if (detail.type == 'PAGEBREAK') return <Pagebreak {...props} />;
        
        return <ClassifiedOutput {...props} />;

    });

};