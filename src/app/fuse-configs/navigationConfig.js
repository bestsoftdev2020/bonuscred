const navigationConfig = [
    {
        'id'      : 'applications',
        'title'   : 'Applications',
        'type'    : 'group',
        'icon'    : 'apps',
        'children': [
            {
                'id'   : 'dashboard-component',
                'title': 'Dashboard',
                'type' : 'item',
                'icon' : 'whatshot',
                'url'  : '/dashboard'
            },
            {
                'id'   : 'userlist-component',
                'title': 'Userlist',
                'type' : 'item',
                'icon' : 'whatshot',
                'url'  : '/userlist'
            },
            {
                'id'   : 'salesreport-component',
                'title': 'SalesReport',
                'type' : 'item',
                'icon' : 'whatshot',
                'url'  : '/salesreport'
            },
        ]
    }
];

export default navigationConfig;
