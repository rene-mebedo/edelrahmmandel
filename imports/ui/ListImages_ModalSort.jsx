import React, { Fragment , forwardRef } from 'react';

import { useImages } from '../client/trackers';

import Image from 'antd/lib/image';

export const ListImages_ModalSort = forwardRef(({imageOrImages, id, ...props}, ref) => {
    const [ images, isLoading ] = useImages(imageOrImages.map( image => image._id ));

    if (isLoading) return null;

    return (
        <Fragment>
            {
                images.map( image => <Image key={image._id} src={image.link} /> )
                //images.map( image => <Image key={image._id} src={image.link} width="100%" {...props} ref={ref} >{id} </Image> )
                //images.map( image => <div {...props} ref={ref}>{id} <Image key={image._id} src={image.link} width="100%" /> </div> )
                //images.map( image => <ImageAnnotation key={image._id} src={image.link} src2={image.link2} refOpinion={image.meta.refOpinion} imageId={image._id} annotationState={image.meta.annotState} /> )
            }
        </Fragment>
    )
});