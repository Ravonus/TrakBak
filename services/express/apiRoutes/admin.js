'use strict';

const express = require('express'),
    server = require('../server').app,
    passport = require('passport'),
    router = express.Router();
require('../middleware/passport');

router.route('').get(async (req, res) => {
    let user = req.user;

    res.render('admin');

});

server.use('/admin', passport.authenticate(['jwt', 'cookie'], { session: false }), server.permissions(1), router);