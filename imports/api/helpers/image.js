import { Images } from '../collections/images';

/**
 * Get marked image source as String from fileID.
 * 
 * @param fileID
 */
 export const getMarkedImageSrc = ( fileID ) => {
    let imgSrc = '';
    const image = Images.findOne( {_id: fileID} );
    if ( image
        && image.meta
        && image.meta.annotState
        && image.meta.annotStateImage
        && image.meta.annotState.markers
        && image.meta.annotState.markers.length ) {
        // Es sind Markierungen im Bild vorhanden, also Bild inkl. Markierung setzen.
        imgSrc = `<img src=${image.meta.annotStateImage}>`;
    }
    return imgSrc;
 }