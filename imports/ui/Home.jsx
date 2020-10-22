import { Meteor } from 'meteor/meteor';
import React, {Fragment} from 'react';
import { 
    PageHeader, 
    Breadcrumb 
} from 'antd';

export const Home = () => {
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>Start</Breadcrumb.Item>
            </Breadcrumb>

            <PageHeader
                className="site-page-header"
                title="Start"
                //subTitle=""
            />
        </Fragment>
    );
}