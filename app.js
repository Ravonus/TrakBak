'use strict';

const CronJob = require('cron').CronJob,
    imap = require('./services/mail/imap/imap');

global.log = require('./functions/messenger');
global.config = require('./config/scripts/config');
global.appRoot = __dirname;
require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

Promise.all(require('./config/scripts/config').doneArray).then(async (data) => {

    global.config.bash = data[0];
    global.config.mail = data[2];
    global.config.express = data[3];
    global.config.mongo = data[4];
    global.config.vimeo = data[5];

    global.hostname;
    if (config.express.port) {
        global.hostname = `${config.express.hostname}:${config.express.port}`
    } else {
        global.hostname = config.express.hostname;
    }

    global.m_models = require('./controllers/mongoose/mongoose').models;
    require('./services/express/server');
    require('./services/express/routes/mongooseAutomationRoutes');
    

    

    //set up global groups. This helps for caching all groups.

    let job = new CronJob('*/10 * * * * *', function () {
        imap({
            tls: true,
            host: config.mail.host,
            user: config.mail.user,
            password: config.mail.pass,
            port: 993
        }, {
                folder: 'autoTicket'
            })
    }, null, true, 'America/Denver');

    job.start();

});
