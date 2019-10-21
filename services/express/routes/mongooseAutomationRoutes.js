'use strict';

const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    server = require('../server').app,
    socketRoutes = require('../../sockets/socketAutomationRoutes'),
    io = require('../../sockets/socket.io'),
    systemNotification = require('../../notifications/systemNotifications'),
    mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    router = express.Router(),
    passport = require('passport'),
    dir = __dirname,
    apiModels = `${path.join(dir, '../../../', 'apiModels')}`,
    {
        promisify
    } = require('util'),
    modelFiles = fs.readdirSync(apiModels);

let models = mongoose.models,
    secondarySearch = [],
    types = ['post', 'get', 'put', 'delete'],
    crud = ['m_create', 'm_read', 'm_update', 'm_delete'],
    rf = [];

async function asyncRoute() {

    await Functions.asyncForEach(modelFiles, async (file, index) => {


        let filename = file.slice(0, file.length - 3);

        let model = require(`${apiModels}/${file}`);
        let options = {};
        if (model) options = await require(`${apiModels}/${file}`).options;

        options.path = options.prefix ? `/${options.prefix}/${options.url ? options.url : filename}` : `/${options.url ? options.url : filename}`;

        for (let i = 0; i < 4; i++) {
            let permissions = options.permissions ? options.permissions : undefined;
            let groups = options.groups ? options.groups : undefined;

            if (options.api !== false && options.routes[crud[i]].api === undefined || options.routes[crud[i]].api && options.routes[crud[i]].api !== false) {

                let route = {

                    route: async (req, res) => {

                        let gui, pageLoad;

            
                  

                        if (req.query.api === undefined && req.query.pageLoad || req.body.api === undefined) {
                            
                            gui = req.query.api;
                            pageLoad = req.query.pageLoad;
                            delete req.query.pageLoad;
                            delete req.query.api;
                            delete req.body.pageLoad;
                            delete req.body.api;



                        } else {
                            gui = req.query.api;
                            delete req.query.api;
                            delete req.body.api;
                            res.setHeader('Content-Type', 'application/json');
                        }




                        var modelOptions = await model.options;


                        let socketCheck = req._parsedUrl.pathname.split('/')[2].toLowerCase();



                        let options = {
                            client: req.headers && req.headers.referer && req.headers.referer.includes(config.express.hostname) ? true : false,
                            page: Object.keys(req.query).length !== 0 && req.query.page && !req.query.start ? Number(req.query.page) - 1 : req.query.start ? req.query.start / req.query.length : undefined,
                            perPage: Object.keys(req.query).length !== 0 && req.query.perPage && !req.query.length ? req.query.perPage : req.query.length ? req.query.length : undefined,
                            populate: Object.keys(req.query).length !== 0 && req.query.populate ? req.query.populate : undefined,
                            deep: Object.keys(req.query).length !== 0 && req.query.deep ? req.query.deep : undefined,
                            fillColumns: Object.keys(req.query).length !== 0 && req.query.fillColumns && !req.query.length ? req.query.fillColumns : req.query.length ? req.query.length : undefined,
                            socketInfo: Object.keys(req.query).length !== 0 && req.query.socketInfo ? req.query.socketInfo : req.body.socketInfo ? req.body.socketInfo : {
                                script: "socketPush",
                                room: req.query.room ? req.query.room : req.body.room,
                                object: req.query.type ? req.query.type : req.body ? req.body.type : undefined,
                                id: ''
                            },
                            dataTable: req.query.dataTable ? req.query.dataTable : req.body.dataTable,
                            excludes: Object.keys(req.query).length !== 0 && req.query.excludes ? req.query.excludes : req.body.excludes ? req.body.excludes : undefined,
                            count: Object.keys(req.query).length !== 0 && req.query.count ? req.query.count : undefined,
                            or: Object.keys(req.query).length !== 0 && req.query.or ? req.query.or : undefined,
                            searching: Object.keys(req.query).length !== 0 && req.query.searching ? req.query.searching : undefined,
                            where: req.query.where ? req.query.where : req.body.where ? req.body.where : undefined
                        };

                        if (modelOptions.path.includes(":")) {
                            let name = req.path.split("/")[2];

                            if (name.toLowerCase() !== "_all") {

                                

                                if (req.query.col) {
                                    req.query[req.query.col] = decodeURI(name);
                                    delete req.query.col;



                                } else
                                    req.query[name.match(/^[0-9a-fA-F]{24}$/) ? '_id' : 'name'] = `${decodeURI(name)}${Object.keys(req.query).includes('?') ? '?' : ''}`;
                            }

                        }

                        if(Object.keys(req.query).includes('?')) delete req.query['?'];
                        if (options.page || Number(options.page) === 0) delete req.query.page;
                        if (options.perPage) delete req.query.perPage;
                        if (options.fillColumns && req.body.fillColumns) delete req.body.fillColumns;
                        if (options.fillColumns && req.query.fillColumns) delete req.query.fillColumns;
                        if (options.count) delete req.query.count;
                        if (options.populate) delete req.query.populate;
                        if (options.or) delete req.query.or;
                        if (options.deep && req.body.deep) delete req.body.deep;
                        if (options.deep && req.query.deep) delete req.query.deep;
                        if (options.excludes && req.body.excludes) delete req.body.excludes;
                        if (options.excludes && req.query.excludes) delete req.query.excludes;
                        if (options.searching && req.query.searching) delete req.query.searching;
                        if (options.searching && req.body.searching) delete req.body.searching;
                        if (options.dataTable && req.query.dataTable) delete req.query.dataTable;
                        if (options.dataTable && req.body.dataTable) delete req.body.dataTable;



                        if (options.where) {

                            try {
                                options.where = JSON.parse(options.where);
                            } catch (e) {

                            }

                            delete req.query.where;
                            delete req.body.where;
                        }
                        if (options.socketInfo) {

                            if (req.query.socketInfo) delete req.query.socketInfo;
                            if (req.body.socketInfo) delete req.body.socketInfo;

                            if (types[i] == 'post' || types[i] == 'put' || types[i] == 'delete') {
                                options.populate = '';
                                let paths = models[filename].schema.paths;
                                await Functions.asyncForEach(Object.keys(paths), async (key) => {

                                    if (paths[key].options.ref) {
                                        options.populate += `${key} `;

                                    }
                                });
                                if (req.originalUrl.includes('/api/messages')) {
                                    options.excludes = '-messages -groups -permissions';
                                    options.populate = 'sender';
                                }
                            }

                        }

                        let query = Object.keys(req.body).length !== 0 ? {
                            query: req.body
                        } : {
                            query: req.query
                        };

                        let dataTableSearch = {};

                        if (req.query.columns) {

                            await Functions.asyncForEach(req.query.columns, (column, index) => {

                                if (req.query.order && Number(req.query.order[0].column) === index) {

                                    options.sort = column.data;
                                    options.direction = req.query.order[0].dir;
                                }

                                dataTableSearch[column.data] = req.query.search && req.query.search.value ? req.query.search.value : '';

                                if (dataTableSearch[column.data] !== '') options.searching = true;

                            });
                            query = {
                                query: dataTableSearch
                            };

                            if (options.type) delete options.type;

                        }

                        if (Object.keys(options).length !== 0) query = Object.assign(
                            query, options);

                        await Functions.asyncForEach(Object.keys(query.query), async (key) => {
                            var popSearch = [];
                            if (options.populate) {
                                popSearch = key.split('.');
                            }
                            var value = query.query[key];

                            if (popSearch.length > 1) {

                                try {
                                    let modelName = file.slice(0, -3);



                                    let ref = Array.isArray(model[modelName].schema.paths[popSearch[0]].options.type) ?
                                        model[modelName].schema.paths[popSearch[0]].options.type[0].ref :
                                        model[modelName].schema.paths[popSearch[0]].options.ref;

                                    let pOptions = JSON.parse(JSON.stringify(options));

                                    pOptions.sort = popSearch[1];
                                    pOptions.page = 0;
                                    pOptions.perPage = 0;
                                    delete pOptions.populate;

                                    let combine = Object.assign({
                                            query: {
                                                [popSearch[1]]: value
                                            }
                                        },
                                        pOptions);

                                    let lookup = await models[ref].m_read(combine).catch(e => console.log(e));
                                    if (lookup && !Array.isArray(lookup) || Array.isArray(lookup) && lookup.length !== 0) {
                                        delete query.query[key];
                                        let ids = {
                                            $in: []
                                        }

                                        if (Array.isArray(lookup) && lookup.length > 1) {
                                            await Functions.asyncForEach(lookup, (doc) => {
                                                ids.$in.push(mongoose.Types.ObjectId(doc._id))
                                            });
                                        }

                                        query.query[popSearch[0]] = ids.$in.length === 0 ? lookup[0]._id : ids;

                                        if (query.sort === key) {
                                            query.sort = popSearch[0];
                                        }

                                    } else {
                                        delete query.query[key];

                                    }
                                } catch (e) {

                                    //     console.log(e);

                                }



                            }

                        });

                        // if (req.query.body.newDoc) {
                        //     req.newDoc = req.query.body.newDoc;
                        //     delete req.query.body.newDoc;
                        // }
                        let data;
                        if (!req.skipDB)
                            data = await models[filename][crud[i]](query).catch(e => console.log('thois is it', e));


                        if (data && data.collectionSize) {

                            let collectionSize = data.collectionSize;
                            let recordsFiltered = data.searchCount ? data.searchCount : collectionSize;
                            delete data.collectionSize;

                            let dataTableObj = {
                                data: data,
                                draw: req.query.draw,
                                recordsTotal: collectionSize,
                                recordsFiltered
                            };

                            data = dataTableObj;

                        } else if (!data)
                            data = req.custom ? req.custom : {};


                        if (Object.keys(data).length !== 0 && !data.err && types[i] == 'post' || types[i] == 'put' || types[i] == 'delete') {
                            let sendData = data.data ? data.data : data;
                            systemNotification(filename, sendData);
                            let notfication = new Notification(sendData, query.query.text, {
                                model: models[filename],
                                sender: sendData.sender ? sendData.sender : undefined,
                                route: types[i]
                            });
                            // notfication.socketNotification()
                            // notfication.emailNotification()
                            notfication.exec(['socketNotification', 'emailNotification']);

                        }
                        var dataTable = options.dataTable;
                        if (dataTable && _sockets.myRooms[socketCheck]) {

                            dataTable = JSON.parse(dataTable);
                            dataTable.objId = query.where[Object.keys(query.where)[0]];
                            let options = {
                                type: (dataTable && dataTable.sid) ? 'to' : 'in',
                                room: socketCheck,
                                script: "socketInterpretation"
                            };

                            _sockets.broadcast(dataTable.sid ? dataTable.sid : '', options, Object.assign(data, {
                                dataTable
                            }));

                        }

                        if (data && data.collectionSize !== undefined && data.collectionSize == 0)
                            return res.status(200).send(JSON.stringify({
                                "data": [],
                                collectionSize: 0,
                                recordsFiltered: 0,
                                recordsTotal: 0
                            }));

                        if (!pageLoad) {
                            var urlPath = req.url.split('/')[1]

                            switch (urlPath) {
                                case 'watch':
                                    pageLoad = 'watch';
                                    break;
                                default:
                                    pageLoad = 'dashboard';
                                    break;
                            }
                        }

                        if (modelOptions.gui && gui === undefined || gui === false) {

                            console.log("WTF RUNNING ", gui)

                            res.render('index', {
                                socketRequest: pageLoad,
                                data: JSON.stringify(data)
                            });




                        } else
                            res.status(200).send(JSON.stringify(data));

                    },
                    path: options.path,
                    type: types[i],
                    permissions: options.permissions ? options.permissions : 0,
                    groups: options.groups ? options.groups : []

                };

                if (options.routes && options.routes[crud[i]]) {
                    permissions = options.routes[crud[i]].permissions ? options.routes[crud[i]].permissions : options.permissions;

                    groups = options.routes[crud[i]].groups ? options.routes[crud[i]].groups : options.groups;
                }

                let authentication;
                if (permissions || groups) authentication = passport.authenticate(['jwt', 'cookie'], {
                    session: false
                });
                rf.push(route);

                if (authentication) {

                    if(route.path === '/watch/:path') {
                        console.log("HERE")
                        console.log(route.route)
                        console.log(permissions)
                    }
                   

                    router.route(route.path)[route.type](authentication, server.permissions(permissions), server.policy(true), route.route);
                } else {
                    router.route(route.path)[route.type](server.policy(true), route.route);
                }

            }

            if (options.socket !== false && options.routes[crud[i]].socket === undefined || options.routes[crud[i]].socket && options.routes[crud[i]].socket !== false) {

                if (index === modelFiles.length - 1 && i > 2) {
                    options.last = true;
                }
                await socketRoutes(types[i], filename, options);

            }

        }
    });

    const Notification = require('../../notifications/userNotification');

    server.use('/', router);
}

asyncRoute();