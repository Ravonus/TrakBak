'use strict';

const express = require('express'),
    server = require('../server').app,
    passport = require('passport'),
    Users = require('mongoose').models.Users,
    router = express.Router();
require('../middleware/passport');

var pathSet = '/me';
router.route('').get(async (req, res) => {
    let user = req.user;

    user = await Users.m_read({type:'findById', populate:'groups navigations avatar', deep: {'groups':'navigations'}, query:{_id:req.user._id}});

    res.setHeader('Content-Type', 'application/json');

    //socket rooms this should be seperated into it's own file eventually
    if (user.groups.some(e => e.name === 'Administrators' || e.name === 'video_mod')) _sockets.joinRoom(_sockets.socket, {room:"video_mods", id:req.cookies.io});



    res.send(JSON.stringify(user));

});

server.use('/api' + pathSet, passport.authenticate(['jwt', 'cookie'], {
    session: false
}), server.permissions(13), router);