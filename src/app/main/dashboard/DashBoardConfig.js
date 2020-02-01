import {FuseLoadable} from '@fuse';

export const DashBoardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard',
            component: FuseLoadable({
                loader: () => import('./DashBoard')
            })
        }
    ]
};
