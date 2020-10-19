import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import { 
    PageHeader, 
    Breadcrumb 
} from 'antd';

export const GutachtenForm = () => {
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Start</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">Gutachten</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                className="site-page-header"
                title="Gutachten"
                subTitle="Übersicht der Ihnen zugewiesenen oder von Ihnen erstellten Gutachten."
            />
        </Fragment>
    );
}