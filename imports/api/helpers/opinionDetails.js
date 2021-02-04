import { OpinionDetails } from '../collections/opinionDetails';


/**
 * Reposition all details for the given opinion
 * 
 * @param {String} refOpinion Specifies the id of the opinion
 */
export const rePositionDetails = refOpinion => {

    const rePosition = (refDetail, depth = 0, parentPosition, printParentPosition) => {
        let positionCount = 0,
            printPositionCount = 0;
        depth++;
    
        OpinionDetails.find({
            refOpinion,
            refParentDetail: refDetail,
            //deleted: false,
            finallyRemoved: false
        }, {
            sort: { parentPosition: 1, position: 1 }
        }).forEach( ({ _id, type }) => {
            positionCount++;
            parentPosition = parentPosition || '';
            
            printParentPosition = printParentPosition || '';
            if ( type == 'HEADING' || type == 'QUESTION' || type == 'PICTURECONTAINER') printPositionCount++;
    
            rePosition(_id, depth, parentPosition + positionCount + '.', printParentPosition + printPositionCount + '.');
    
            OpinionDetails.update(_id, {
                $set: {
                    position: positionCount,
                    parentPosition,
                    printPosition: printPositionCount,
                    printParentPosition,
                    depth
                }
            });
        });
    }

    rePosition(null);
}
