import React from 'react';

import Space from 'antd/lib/space';
import Alert from 'antd/lib/alert';

import moment from 'moment';

export const MaintenanceNotice = ( { serviceMaintenance }) => {
    let text;
    if ( serviceMaintenance && serviceMaintenance.active )
        text = 'Es findet eine geplante Systemwartung statt: ' + moment( serviceMaintenance.dateStart ).format( 'DD.MM.YYYY' ) + ' ' + serviceMaintenance.plannedServiceTime;

    return (
        <div className="mbac-maintananceNotice">
            <Space
                direction="vertical"
                style={{
                width: '100%',
                }}>
    
                <Alert message={text} banner closable />
            </Space>
        </div>
    )
}
