'use strict';

const express = require('express'),
    server = require('../server').app,
    mailer = require('../../../services/mail/mailer'),
    cookie = require('cookie'),
    jwt = require('jsonwebtoken'),
    {
        Users
    } = require('../../../apiModels/Users'),
    router = express.Router()

var pathSet = '/verify/:id';
router.route(pathSet).get(async (req, res) => {
    let cookies = {};
    if (req.headers.cookie) cookies.jwt = cookie.parse(req.headers.cookie);
    let err;
    let verified = req.params.id;

    if (verified) {
        let _id = req.query.lookup
        let user = await Users.m_read({
            query: {
                _id,
                verified
            },
            type: 'findOne'
        }).catch(e => {
            err = true;
            res.status(401).send({
                "err": "uknown1"
            });
        });

        if (user) {
            await Users.m_update({
                where: {
                    _id
                },
                body: {
                    verified: null
                }
            }).catch(e => {
                err = true;
                res.status(401).send({
                    "err": "uknown3"
                });
            });

            user.verified = '';

            let objSend = {};

            objSend.cookie = await jwt.sign(JSON.stringify(user), config.express.jwt);

            objSend.user = user;

            if (!err) res.status(200).send(JSON.stringify(objSend));

        } else {
            res.redirect('/?status=unknownError');
        }
    }
});

server.use('/auth', router);