import React, { Fragment } from 'react';
import markerjs2 from 'markerjs2';

export class ImageAnnotation extends React.Component {
    constructor(props) {
        super(props);

        this.imgRef = React.createRef();
        this.imgRefOri = React.createRef();

        if ( this.props.annotationState
          && this.props.src2
          && this.props.annotationState.markers
          && this.props.annotationState.markers.length )
            this.src = this.props.src2;
        else
            this.src = this.props.src;
    }

    showMarkerArea() {
        if (this.imgRefOri.current !== null) {
            const markerArea = new markerjs2.MarkerArea(this.imgRefOri.current);
          
            // attach an event handler to assign annotated image back to our image element
            markerArea.addRenderEventListener((dataUrl, state) => {
                if (this.imgRef.current) {
                    this.imgRef.current.src = dataUrl;
                }

                Meteor.call( 'images.update.annotState' , this.props.imageId , state , dataUrl , err => {
                    console.log('Fertig', err);
                });
            });

            markerArea.settings.displayMode = 'popup';
            //markerArea.renderAtNaturalSize = true;
            markerArea.renderImageType = 'image/jpeg';
            markerArea.renderImageQuality = 1; //0.5;

            // Verfügbare Marker einstellen:
            markerArea.availableMarkerTypes = markerArea.ALL_MARKER_TYPES;
            //markerArea.availableMarkerTypes = ['FrameMarker', markerjs2.ArrowMarker];
            //markerArea.availableMarkerTypes = markerArea.BASIC_MARKER_TYPES;

            // Marker Defaults festlegen:
            markerArea.settings.defaultColorSet = [
                '#F6A615',// orange. Nach MEBEDO Styleguide, https://www.colorhexa.com/f6a615
                '#FFFF00', // yellow
                '#EF4444', // red
                //'#10B981', // green
                '#20B14C', // green
                '#2563EB', // blue
                '#000000', // black
                '#FFFFFF'  // white
                //'#7C3AED', // purple
                //'#F472B6'  // pink
            ];
            markerArea.settings.defaultColor = '#F6A615';// orange. Nach MEBEDO Styleguide, https://www.colorhexa.com/f6a615
            markerArea.settings.defaultFontFamily = 'Arial';
            markerArea.settings.defaultStrokeWidths = [1, 2, 3, 5, 10, 15, 20];
            markerArea.settings.defaultStrokeWidth = 10;
            markerArea.settings.defaultStrokeColor = '#F6A615';// orange. Nach MEBEDO Styleguide, https://www.colorhexa.com/f6a615
            markerArea.settings.defaultFillColor = '#F6A615';// orange. Nach MEBEDO Styleguide, https://www.colorhexa.com/f6a615
            markerArea.settings.defaultHighlightColor = '#FFFF00';// yellow
            markerArea.settings.defaultHighlightOpacity = 0.50;
            
            markerArea.show();

            if (this.props.annotationState) {
                markerArea.restoreState(this.props.annotationState);
            }
        }
    }

    render() {
        const mystyle1 = {
            maxWidth: '100%',
            zIndex: '2'            
        };
        const mystyle2 = {
            visibility: 'hidden',
            position: 'absolute',
            zIndex: '1'
        };
        
        return (
            <Fragment>
                <img
                    ref={this.imgRef} 
                    src={this.src}
                    style={mystyle1}
                    onClick={() => this.showMarkerArea()}
                />
                <img
                    ref={this.imgRefOri} 
                    src={this.props.src}  
                    style={mystyle2}
                />                
            </Fragment>
        )
    }
}