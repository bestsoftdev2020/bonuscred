import {FuseLoadable} from '@fuse';

export const SalesReportConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/salesreport',
            component: FuseLoadable({
                loader: () => import('./SalesReport')
            })
        }
    ]
};
