import React from 'react';
import PageHeader from 'antd/lib/page-header';
import Breadcrumb from 'antd/lib/breadcrumb';
import Space from 'antd/lib/space';
import Affix from 'antd/lib/affix';
import Layout from 'antd/lib/layout';

const { Content } = Layout;

import { ModalOpinion } from './modals/Opinion';
import { ListUsersAdmin } from './ListUsersAdmin';

import { hasPermission } from './../api/helpers/roles';

export const UsersAdminForm = ({currentUser}) => {

    let hasAdminRole = false;
    if ( currentUser )
    {
        currentUser.userData.roles.forEach( role => {
            if ( role === 'ADMIN' )
                hasAdminRole = true;
        });
    }
    return (
        <Layout>
            <Content>
                <Affix className="affix-opiniondetail" offsetTop={0}>
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <a href="/">Start</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="">Benutzer (Admin)</a>
                            </Breadcrumb.Item>
                        </Breadcrumb>

                        <PageHeader
                            className="site-page-header"
                            title="Benutzer (Administration)"
                            subTitle="Übersicht aller Benutzer im System."
                        />
                    </div>
                </Affix>

                {
                    hasAdminRole ?
                    <ListUsersAdmin />
                    : <>--- Keine Berechtigung ---</>
                }
            </Content>
        </Layout>
    );
}