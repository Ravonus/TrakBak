'use strict';

const fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose');

let page = 'index';
let models = {};

var pathSet = '/watch';

module.exports = {
    route: async (req, res) => {
        var options = {

            populate:"uploader",
            type:'find',
            direction:'desc',
            client:true,
            page:0,
            sort:'createdAt',
            excludes: '',
            perPage:8

        };

        var query = {};

        let categories = await mongoose.models.Videos.m_read(Object.assign({query},options));

        res.render(page, {socketRequest:'watch', data:JSON.stringify(categories)});
    },
    path: pathSet,
    type: 'get'
};

// require('./mongooseAutomationRoutes');