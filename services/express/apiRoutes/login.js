'use strict';

const express = require('express'),
    server = require('../server').app,
    router = express.Router();
require('../middleware/passport');

router.route('').get(async (req, res) => {
    res.render('pages/login.ejs');
});

server.use('/login', router);