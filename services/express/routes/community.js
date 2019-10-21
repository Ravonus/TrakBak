'use strict';

const fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose');

let page = 'index';
let models = {};

var pathSet = '/forums';

module.exports = {
    route: async (req, res) => {
        var options = {

            populate:"topics",
            deep:'{"topics":["logo","img"]}',
            type:'find',
            direction:'asc',
            client:true,
            page:0,
            sort:'createdAt',
            excludes: '',
            perPage:100

        };

        var query = {
            
            topics: { '$gt':[] },
            enabled:true
        };

        let categories = await mongoose.models.Categories.m_read(Object.assign({query},options));

        res.render(page, {socketRequest:'forums', data:JSON.stringify(categories)});
    },
    path: pathSet,
    type: 'get'
};

// require('./mongooseAutomationRoutes');