// hier drin erfolgt die Datenübernahme
//import sql from 'mssql';

//import { OpinionLayerA } from '../../imports/api/collections/opinionLayerA';

//OpinionLayerA.insert({});

// Aktualisieren aller OpinionDetails positionsnummer
import { Opinions } from '../../imports/api/collections/opinions';
import { OpinionDetails } from '../../imports/api/collections/opinionDetails';

//return;

console.log('Start rePositioning...');
const rePositionDetails = (refOpinion, refDetail, depth = 1, parentPosition) => {
    let positionCount = 0;

    OpinionDetails.find({
        refOpinion,
        refParentDetail: refDetail
    }, {
        sort: { orderString: 1 }
    }).forEach( ({_id, position}) => {
        positionCount++;
        parentPosition = parentPosition || '';
        rePositionDetails(refOpinion, _id, ++depth, parentPosition + positionCount + '.');

        OpinionDetails.update(_id, {
            $set: {
                position: positionCount,
                parentPosition,
                depth
            }
        });
        //console.log('update', _id, positionCount, parentPosition + positionCount + '.');
    });
}

Opinions.find({}).forEach( ({ _id }) => {
    rePositionDetails(_id, null);
});

console.log('ready');
