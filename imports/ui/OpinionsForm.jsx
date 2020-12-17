import { Meteor } from 'meteor/meteor';
import React, {Fragment, useState} from 'react';
import { 
    PageHeader, 
    Breadcrumb,
} from 'antd';

import { ModalOpinionNew } from './modals/OpinionNew';
import { ListOpinions } from './ListOpinions';

export const OpinionsForm = () => {
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

            <ListOpinions />

            <ModalOpinionNew />
        </Fragment>
    );
}