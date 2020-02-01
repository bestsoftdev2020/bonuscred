import {FuseLoadable} from '@fuse';

export const UserListConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/userlist',
            component: FuseLoadable({
                loader: () => import('./UserList')
            })
        }
    ]
};
