'use strict';

const express = require('express'),
    server = require('../server').app,
    Users = require('../../../apiModels/Users'),
    jwt = require('jsonwebtoken'),
    mailer = require('../../../services/mail/mailer'),
    router = express.Router();

var pathSet = '/forgot';
var routePath = '/auth';
pathSet += routePath;

router.route('').post(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (!req.body.login) return res.status(400).send({ alert: { title: "Password reset", type: "error", text: "Need account name in order to send reset link." } });


    let Account = await Accounts.read({ login: req.body.login }).catch(e => {
        return res.status(400).send({ alert: { title: "Password reset", type: "error", text: "Could not find account or character" } });
    });

    if (Account[0]) {

        let charLookup = {
            accid: Account[0].id
        }

        if (req.body.character) charLookup.charname = req.body.character;

        let Character = await Chars.read(charLookup).catch(e => { });

        if (!req.body.character && !Character) {
        } else if (!req.body.character && Character) {
            return res.status(400).send({ alert: { title: "Password reset", type: "error", text: "Could not find account or character" } });
        } else if (Character) {

        } else {
            return res.status(400).send({ alert: { title: "Password reset", type: "error", text: "Could not find account or character" } });
        }

        let email = await Users.read({ accid: Account[0].id }).catch(e => { });

        if (email) {

            let hostname;
            if (config.express.port) {
                hostname = `${config.express.hostname}:${config.express.port}`
            } else {
                hostname = config.express.hostname;
            }

            let jwtToken = await jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: email[0].accid
            }, config.express.jwt)

            mailer({ subject: "Password request link", from: config.mail.user, to: email[0].email }, {
                name: 'passwordReset',
                replace:{
                     server: "Mog Garden" ,
                     link: `${hostname}/?rp=${jwtToken}` ,
                     link2: `${hostname}/didnotrequest/${jwtToken}` ,
                     user: req.body.login }
                
            });
        }

        return res.status(200).send({ alert: { title: "Password reset", type: "success", text: "Sent password reset to registered email address" } });
    }

});

server.use(pathSet, server.policy(true), router);