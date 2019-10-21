'use strict';

const express = require('express'),
    server = require('../server').app,
    router = express.Router(),
    randomstring = require("randomstring"),
    mailer = require('../../../services/mail/mailer'),
    { Users } = require('../../../apiModels/Users');

require('../middleware/passport');

var pathSet = '/buffer';
router.route(pathSet).post(async (req, res) => {

    let randomKey = randomstring.generate(32);

    var data = req.body;

    res.setHeader('Content-Type', 'application/json');

    var bash = {
        verified: randomKey,
        permissions: 6,
    };
    
    for (let i = 0; i < data.children.buffer.length; i++) {

        if (data.children.buffer[i].name === "Server") { i = data.children.buffer.length; }
        else {
            var key = data.children.buffer[i].name;
            var value = data.children.buffer[i].value;
            bash[key] = value;
        }
    }

    
    if (config.express.port) {
        hostname = `${config.express.hostname}:${config.express.port}`
    } else {
        hostname = config.express.hostname;
    }

    var user = await Users.create(bash).catch(e => log("mongoModel-error", ['Unity']));
    if (user) {

        mailer({ subject: "Please verify email address.", from: config.mail.user, to: user.email }, {
            name: 'emailVerification',
            replace: 
                { server: "Super Bashbots",
                link: `${hostname}/auth/?verify=${randomKey}&lookup=${user._id}`,
                user: user.account }
            
        });

        res.send(JSON.stringify(data))
    } else {
        res.send(JSON.stringify({ err: "THERE WAS AN ERROR." }));
    }

});

server.use('/bash', router);