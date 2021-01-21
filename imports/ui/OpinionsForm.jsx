import React, { Fragment } from 'react';
import PageHeader from 'antd/lib/page-header';
import Breadcrumb from 'antd/lib/breadcrumb';
import Space from 'antd/lib/space';

import { ModalOpinion } from './modals/Opinion';
import { ListOpinions } from './ListOpinions';

import { hasPermission } from './../api/helpers/roles';

export const OpinionsForm = ({currentUser}) => {
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

            <Space>
                { hasPermission({currentUser}, 'opinion.create') ? <ModalOpinion mode="NEW" /> : null }
                { hasPermission({currentUser}, 'opinion.manageTemplate') ? <ModalOpinion mode="NEW" createTemplate={true} /> : null }
            </Space>
        </Fragment>
    );
}