import React, { Fragment, useEffect, useState } from 'react';
import List from 'antd/lib/list';
import Table from 'antd/lib/table';

import moment from 'moment';

import { useAllUsersForAdmin } from '../client/trackers';
import { MediaQuery, useMediaQueries } from '../client/mediaQueries';

import Input from 'antd/lib/input';

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
            sorter: (a, b) => lower(a.username).localeCompare(lower(b.username)),
        },
        {
            title: 'active',
            dataIndex: 'active',
            key: 'active',
            sorter: (a, b) => lower(a.active).localeCompare(lower(b.active)),
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
            sorter: (a, b) => lower(a.createdAt).localeCompare(lower(b.createdAt)),
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
