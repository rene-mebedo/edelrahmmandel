import React from 'react'

import Skeleton from 'antd/lib/skeleton';

import { useOpinionDetail } from '../client/trackers';
import { Heading } from './ListOpinionDetails/detailtypes/Heading';
import { Text } from './ListOpinionDetails/detailtypes/Text';
import { Answer } from './ListOpinionDetails/detailtypes/Answer';
import { Bestimmungen } from './ListOpinionDetails/detailtypes/Bestimmungen';
import { Pagebreak } from './ListOpinionDetails/detailtypes/Pagebreak';
import { ClassifiedOutput } from './ListOpinionDetails/detailtypes/ClassifiedOutput';
import { Question } from './ListOpinionDetails/detailtypes/Question';


export const OpinionDetailContent = ({refOpinion, refDetail, permissions}) => {
    const [detail, detailIsLoading] = useOpinionDetail(refOpinion, refDetail);

    if (detailIsLoading) {
        return (
            <Skeleton paragraph={{ rows: 4 }} />
        );
    }

    if (!detail) return null;

    const props = {
        key: detail._id,
        item: detail, 
        permissions,
        first: true,
        last: false
    }
    if (detail.type == 'HEADING') return <Heading {...props} />;
    if (detail.type == 'TEXT') return <Text {...props} />;
    if (detail.type == 'QUESTION') return <Question {...props} />;
    if (detail.type == 'ANSWER') return <Answer {...props} />;
    if (detail.type == 'BESTIMMUNGEN') return <Bestimmungen {...props} />;
    if (detail.type == 'PAGEBREAK') return <Pagebreak {...props} />;
    
    return <ClassifiedOutput {...props} />;
}