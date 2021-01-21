import React, { Fragment } from 'react';

import { useImages } from '../client/trackers';

import Image from 'antd/lib/image';

export const ListImages = ( { imageOrImages } ) => {
    const [ images, isLoading ] = useImages(imageOrImages.map( image => image._id ));

    if (isLoading) return null;

    return (
        <Fragment>
            {
                images.map( image => <Image key={image._id} src={image.link} width="100%" /> )
            }
        </Fragment>
    )
}