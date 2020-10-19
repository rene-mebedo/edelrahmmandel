import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import { 
    PageHeader, 
    Breadcrumb 
} from 'antd';

export const AktivitaetenForm = () => {
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">Application Center</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="">Application List</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>An Application</Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                className="site-page-header"
                title="Aktivitäten"
                subTitle="Übersicht und Zusammenfassung der letzten Aktivitäten"
            />
        </Fragment>  
    );
}