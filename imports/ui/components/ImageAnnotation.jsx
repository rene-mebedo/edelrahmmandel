import React, { Fragment } from 'react';
import markerjs2 from 'markerjs2';

export class ImageAnnotation extends React.Component {
    constructor(props) {
        super(props);

        this.imgRef = React.createRef();
        this.imgRefOri = React.createRef();
    }

    showMarkerArea() {  
        if (this.imgRefOri.current !== null) {
            const markerArea = new markerjs2.MarkerArea(this.imgRefOri.current);
          
            // attach an event handler to assign annotated image back to our image element
            markerArea.addRenderEventListener((dataUrl, state) => {
                if (this.imgRef.current) {
                    this.imgRef.current.src = dataUrl;
                }

                Meteor.call('images.update.annotState', this.props.imageId, state, err => {
                    console.log('Fertig', err);
                });
            });

            markerArea.settings.displayMode = 'popup';
            //markerArea.renderAtNaturalSize = true;
            markerArea.renderImageType = 'image/jpeg';
            markerArea.renderImageQuality = 1; //0.5;

            markerArea.show();

            if (this.props.annotationState) {
                markerArea.restoreState(this.props.annotationState);
            }
        }
    }

    render() {

        return (
            <Fragment>
                <img
                    ref={this.imgRef} 
                    src={this.props.src}
                    style={{ maxWidth: '100%' }}
                    onClick={() => this.showMarkerArea()}
                />

                <img
                    ref={this.imgRefOri} 
                    src={this.props.src}
                    style={{ visibility: 'hidden' }}
                    onClick={() => this.showMarkerArea()}
                />
            </Fragment>

        )
    }
}