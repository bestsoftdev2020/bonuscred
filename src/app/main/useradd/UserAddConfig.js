import {FuseLoadable} from '@fuse';

export const UserAddConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/useradd',
            component: FuseLoadable({
                loader: () => import('./UserAdd')
            })
        }
    ]
};
