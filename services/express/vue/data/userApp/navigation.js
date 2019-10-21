object = {
    lists: {},
    nav: {
        links: [],
        page: 'dashboard',
        subPage: '',
        sub: {},
        lastPage: 'dashboardNav',
        pageSetup: {
            dashboard: {
                header: 'lg'
            },
            forums: {
                header: 'sm',
                categories: true,
                vueSetup: () => {
                    userApp.crud('GET', '/api/categories?populate=topics&deep={"topics":["logo","img"]}&topics=notEmpty&enabled=true', {
                        type: 'vueCustom'
                    });
                }
            },
            rules: {
                header: 'sm'
            },
            watch: {
                header: 'sm',
                watch: true,
                vueSetup: () => {
                    if(!userApp.noCrud)
                    userApp.crud('GET', '/watch/_all?api=true', {
                        type: 'vueCustom'
                    });
                }
            },
            myProfile: {
                header: 'md'
            },
            editProfile: {
                header: 'md'
            },
            settings: {
                header: 'md'
            },

            users: {
                header: 'md',
                name: 'showUsers',

                prefix: 'api',
                lists: [{
                    name: 'test',
                    keys: ['name']
                },{
                    name: 'groups',
                    keys: ['name']
                }, {
                    name: 'navigations',
                    keys: ['name']
                }]
            },
            groups: {
                key: 'name',
                header: 'md',
                name: 'showGroups',
                lists: [{
                    name: 'users',
                    keys: ['account']
                }, {
                    name: 'navigations',
                    keys: ['name']
                }],
                prefix: 'api'
            },
            categories: {
                header: 'md',
                name: 'showCategories',
                lists: [{
                    name: 'topics',
                    keys: ['name'],
                    urlAdd: '&category=isEmpty'
                }, {
                    name: 'groups',
                    keys: ['name']
                }],
                prefix: 'api'
            },
            topics: {
                header: 'md',
                name: 'showCategories',
                lists: [{
                    name: 'categories',
                    keys: ['name']
                }, {
                    name: 'groups',
                    keys: ['name']
                }],
                prefix: 'api'
            },
            videos: {
                header: 'md',
                name: 'showVideos',
                lists: [{
                    name: 'categories',
                    keys: ['name']
                }, {
                    name: 'groups',
                    keys: ['name']
                }],
                prefix: 'api'
            },
            
        },
        switch: (page) => {
            switch (page) {
                case 'editProfile':
                    userApp.nav.subPage = 'Edit Profile';
                    break;
                case 'myProfile':
                    userApp.nav.subPage = 'My Profile';
                    break;
                case 'settings':
                    userApp.nav.subPage = 'My Settings';
                    break;
                case 'users':

                    userApp.mainTableHead = [{
                        name: "ID"
                    }, {
                        name: "Account"
                    }, {
                        name: "Email"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Groups"
                    }];

                    var url = `/api/users?count=t&or=t&populate=groups`;
                    var columns = [{
                            "data": "_id",
                            "name": "ID",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "account",
                            "name": "account",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "email",
                            "name": "email",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "permissions",
                            "name": "permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "groups.name",
                            "name": "groups",
                            render: userApp.renderLoad('groups', 'name')
                        },
                    ]

                    Vue.nextTick(() => {
                        
                        userApp.dataTableFunc(page, 'mainDataTable', url, columns);
                    
                        userApp.lists.groupsList_fast = {url: "/api/groups", key: "name", urlAdd: "", _all: true, fast:true};
                    
                    });


                    break;

                case 'groups':

                    userApp.mainTableHead = [{
                        name: "Name"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Users"
                    }];

                    url = `/api/groups?count=t&or=t&populate=users`;
                    columns = [{
                            "data": "name",
                            "name": "Name",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "permissions",
                            "name": "Permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "users.account",
                            "name": "Users",

                            render: userApp.renderLoad('users', 'account')
                        },
                    ]
                   
                    Vue.nextTick(() => {
                        
                        userApp.dataTableFunc(page, 'mainDataTable', url, columns);
                        $('#tableCard').hammer({taps:2}).bind("tap", (ev) => {
                            console.log(ev)
                            userApp.handler(ev);

                        });
                    
                    });

                    break;

                case 'categories':

                    userApp.mainTableHead = [{
                        name: "Name"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Topics"
                    }];

                    url = `/api/categories?count=t&or=t&populate=topics`;
                    columns = [{
                            "data": "name",
                            "name": "Name",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "permissions",
                            "name": "Permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "topics.name",
                            "name": "Topics",

                            render: userApp.renderLoad('topics', 'name')
                        },

                    ];

                    Vue.nextTick(() => userApp.dataTableFunc(page, 'mainDataTable', url, columns));

                    break;

                case 'topics':

                    userApp.fileNameCheck('uploadCategorySubImg');
                    userApp.fileNameCheck('uploadCategoryImg');

                    
                    userApp.mainTableHead = [{
                        name: "Name"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Category"
                    }];

                    url = `/api/topics?count=t&or=t&populate=category`;
                    columns = [{
                            "data": "name",
                            "name": "Name",
                            "defaultContent": "<i>Not set</i>"

                        },
                        {
                            "data": "permissions",
                            "name": "Permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "category.name",
                            "name": "Category",
                            "defaultContent": "<i>Not set</i>",

                            render: userApp.renderLoad('category', 'name')
                        },
                    ]

                    Vue.nextTick(() => userApp.dataTableFunc(page, 'mainDataTable', url, columns));

                    break;

                case 'videos':

                    userApp.mainTableHead = [{
                        name: "Name"
                    }, {
                        name: "Description"
                    }, {
                        name: "Permissions"
                    }, {
                        name: "Groups"
                    }];

                    url = `/watch/_all?count=t&or=t&populate=category&api=true`;
                    columns = [{
                            "data": "name",
                            "name": "Name",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "description",
                            "name": "Description",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "permissions",
                            "name": "Permissions",
                            "defaultContent": "<i>Not set</i>"
                        },
                        {
                            "data": "groups.name",
                            "name": "Groups",
                            "defaultContent": "<i>Not set</i>",

                            render: userApp.renderLoad('groups', 'name')
                        },
                    ]

                    Vue.nextTick(() => {
                        
                        console.log('vidoes mans');
                        $('#selectVideo').selectpicker();
                        userApp.dataTableFunc(page, 'mainDataTable', url, columns);
                        
                    });

                    break;

                default:
                    break;
            }
        }
    }
}