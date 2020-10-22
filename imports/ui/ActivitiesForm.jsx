import { Meteor } from 'meteor/meteor';
import React, {Fragment} from 'react';
import { 
    PageHeader, 
    Breadcrumb 
} from 'antd';

export const ActivitiesForm = () => {
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Start</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">Aktivitäten</a>
                    </Breadcrumb.Item>
            </Breadcrumb>
            <PageHeader
                className="site-page-header"
                title="Aktivitäten"
                subTitle="Übersicht und Zusammenfassung der letzten Aktivitäten"
            />
        </Fragment>
    );
}