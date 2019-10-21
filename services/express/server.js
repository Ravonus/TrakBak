'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    {
        promisify
    } = require('util'),
    fs = require('fs'),
    path = require('path'),
    multipart = require('connect-multiparty'),
    reqReload = require('require-reload')(require),
    routes = require('./routes/routes'),
    reload = require('reload'),
    app = express(),
    http = require('http').Server(app),
    fileUpload = require('express-fileupload'),
    Sockets = require('../sockets/socket.io'),
    cookieParser = require('cookie-parser'),
    ip = require('ip'),
    auth = require('./apiRoutes/auth'),
    dir = __dirname;

let sockets = new Sockets(http);

sockets.eraseRoutes();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

require('./middleware/passport');

app.permissions = require('./middleware/permissions');
app.groups = require('./middleware/groups');
app.policy = require('./middleware/loadPolicies');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//sockets.connect();
sockets.socketRoute('connect');
sockets.socketRoute('disconnect');

app.use('/videos/:path', multipart());
app.use('/files/:pathType', fileUpload());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/auth', auth);
app.use('/', routes);
app.use(express.static(dir + '/shared'));
app.use(express.static(dir + '/public'));
app.use('/thumbnails', express.static('Video/thumbnails'));
app.use(express.static(path.join(dir, '../../', '/files/profiles')));
app.use('/files', express.static(path.join(dir, '../../', '/files')));


app.get('/resumable.js', function (req, res) {
    var fs = require('fs');
    res.setHeader("content-type", "application/javascript");
    fs.createReadStream(path.join(dir, 'js', 'resumable.js')).pipe(res);
});


//load user vue script (This will add recaptcha to vue if its in config)

fs.readFile = promisify(fs.readFile);

var checkVue = fs.readdirSync(dir + '/vue');
var vueFiles = [];
let push = {};
let firstRun = {};
let myContents = {};

async function recaptchSiteKey(contents) {
    return contents.replace('recaptchSiteKey: recaptchSiteKey', `recaptchSiteKey: "${config.express.recaptchSiteKey}"`);

}

Functions.asyncForEach(checkVue, async (vueFile, index) => {

    if (vueFile.substr(-3) === '.js') {

        vueFiles.push(vueFile);
    }

    if (index === checkVue.length - 1) {
        if (vueFiles.length !== 0) {

            vueFiles.forEach(async (file, index) => {

                async function vueUpdate(files, directory, type) {

                    await Functions.asyncForEach(files, async (fileSecond, index) => {

                        let contents = await fs.readFile(`${dir}/vue/${type}/${directory}/${fileSecond}`, 'utf8');

                        let objects = contents.match(/{([^]+)/);
                        if (config.express.recaptchSiteKey && file == 'userApp.js' && fileSecond === 'data.js') {

                            objects[0] = await recaptchSiteKey(objects[0]);
                        }

                        if (index !== files.length - 1) {
                            push[directory][type] += objects[0].substr(1).slice(0, -1) + ',';
                        } else {
                            push[directory][type] += objects[0].substr(1).slice(0, -1);
                        }

                    });

                    var regex = new RegExp(`${type}: {([^}][^,]+)|${type}:{([^}][^,]+)`, '');
                    if (firstRun[directory]) {
                        firstRun[directory] = false;
                        myContents[directory] = fs.readFileSync(`${dir}/vue/${file}`, 'utf8');
                    }

                    myContents[directory] = await myContents[directory].replace(regex, `${type}: { ${push[directory][type]} }`);
                    await fs.writeFileSync(`${dir}/js/${file}`, myContents[directory]);

                }

                var directory = file.substring(0, file.length - 3);
                if (!firstRun[directory]) firstRun[directory] = true;
                let first = false;
                var files = fs.readdirSync(`${dir}/vue/data/${directory}`, 'utf8');

                push[directory] = {
                    data: '',
                    methods: ''
                };

                if (files.length > 0) vueUpdate(files, directory, 'data');

                files = fs.readdirSync(`${dir}/vue/methods/${directory}`, 'utf8');

                push[directory] = {
                    data: '',
                    methods: ''
                };
                
                if (files.length > 0) vueUpdate(files, directory, 'methods');

            });

        }
        //   awaitArray();
        require('./cssLoad');
        require('./javascriptLoad');
    }

});

async function socketLoad() {
    await sockets.socketOn('joinRoom');
    await sockets.socketOn('leaveRoom');
    await sockets.socketOn('socketPush');
    await sockets.socketOn('sendInfo', {});
    await sockets.socketOn('test', {
        subname: 'get'
    });
    if (sockets.socketRoutesStream) {
        sockets.streamClose();
    }

}

socketLoad();

global._sockets = sockets;

http.listen(config.express.port, () => {
    log('express-started', [ip.address(), config.express.port]);
});

module.exports = {
    app,
    sockets
};

setTimeout(function () {

    let index = reqReload('./routes/index');
    app[index.type](index.path + '1/', index.route);

}, 3000);