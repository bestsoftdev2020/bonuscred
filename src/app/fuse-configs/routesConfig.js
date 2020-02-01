import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseUtils} from '@fuse/index';
import {LoginConfig} from 'app/main/login/LoginConfig';
import {RegisterConfig} from 'app/main/register/RegisterConfig';
import {LogoutConfig} from 'app/main/logout/LogoutConfig';
import {ContactConfig} from 'app/main/contact/ContactConfig';
import {UserAddConfig} from 'app/main/useradd/UserAddConfig';
import {UserListConfig} from 'app/main/userlist/UserListConfig';
import {DashBoardConfig} from 'app/main/dashboard/DashBoardConfig';
import {SalesReportConfig} from 'app/main/salesreport/SalesReportConfig';

const routeConfigs = [
    LoginConfig,
    RegisterConfig,
    LogoutConfig,
    ContactConfig,
    UserAddConfig,
    UserListConfig,
    DashBoardConfig,
    SalesReportConfig,
];

 const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path     : '/',
        component: () => <Redirect to="/login"/>
    }
];

 export default routes;
