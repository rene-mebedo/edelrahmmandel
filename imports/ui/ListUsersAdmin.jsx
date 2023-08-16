import React, { Fragment, useEffect, useState } from 'react';
import List from 'antd/lib/list';
import Table from 'antd/lib/table';

import moment from 'moment';

import { useAllUsersForAdmin } from '../client/trackers';
import { MediaQuery, useMediaQueries } from '../client/mediaQueries';

import Input from 'antd/lib/input';
import { contains } from 'jquery';

const lower = a => {
    if (!a) return '';

    return a.toLowerCase();
}

export const ListUsersAdmin = () => {
    const [ users , isLoading ] = useAllUsersForAdmin();
    const [ filteredUsers , setFilteredUsers ] = useState( users );

    const { isDesktop } = useMediaQueries();

    // Filter zurücksetzen über useEffect:
    // - Wenn isLoading sich ändert, also nachdem alle Benutzer geladen sind. Ansonsten wäre beim ersten Öffnen bzw. neu Laden die Liste leer.
    useEffect( () => {
        setFilteredUsers( users );
      } , [ isLoading ]);

    let columns = [
        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'email(s)',
            dataIndex: 'emails',
            key: 'emails',
            render: (text, row) => {
                if ( typeof row.emails == "undefined" )
                    return '';
                else
                    return JSON.stringify( row.emails );
            }
        },
        {
            title: 'active',
            dataIndex: 'active',
            key: 'active',
            render: (text, row) => {
                if ( typeof row.active == "undefined" ) {
                    // 'active' Feld existiert nicht => aktiv
                    return '1';
                }
                else if ( row.active )
                    return '1';
                else
                    return '0';
            },
        },
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            render: (text, row) => (row.userData.firstName + ' ' + row.userData.lastName ),
            sorter: (a, b) => lower(a.userData.lastName).localeCompare(lower(b.userData.lastName)),
        },
        {
            title: 'roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (text, row) => row.userData.roles.toString(),
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text, row) => moment(row.createdAt).format( 'DD.MM.YYYY HH:mm' ),
            sorter: (a, b) => lower(moment(a).format( 'DD.MM.YYYY HH:mm' )).localeCompare(moment(b).format( 'DD.MM.YYYY HH:mm' )),
        }
    ];
    
    const onChangeText = ( val ) => {        
        if ( val ) {
            const filterText = val.target.value;
            if ( filterText == '' )
                setFilteredUsers( users );
            else
                setFilteredUsers( users.filter( detail => { 
                    return detail.username.toLowerCase().includes( filterText.toLowerCase() );
                }));
        }
    };
      
    return (
        <Fragment>
            <Input
                placeholder="Hier tippen, um die Benutzerliste nach username zu filtern"
                allowClear
                onChange={onChangeText}
            />
            <MediaQuery showAtPhone={true}>
                <List
                    itemLayout="horizontal"
                    dataSource={filteredUsers}
                    loading={isLoading}
                    
                />
            </MediaQuery>

            <MediaQuery showAtTablet={true} showAtDesktop={true}>
                <Table
                    columns={columns} 
                    dataSource={filteredUsers}
                    loading={isLoading}
                    rowKey="_id"
                    pagination={false}
                    showSorterTooltip={false}
                />
            </MediaQuery>
        </Fragment>
    );
}
