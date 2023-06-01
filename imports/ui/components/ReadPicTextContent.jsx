import React, { Fragment } from 'react';

export class ReadPicTextContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div>
                    <div className={`mbac-could-styled-as-deleted`}
                        dangerouslySetInnerHTML={ {__html: this.props.value } }
                    />
                </div>
            </Fragment>
        )
    }
}