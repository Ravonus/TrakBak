'use strict';

const fs = require('fs');
let models = {}
let path = require('path');
// let dirs = fs.readdirSync(path.join(__dirname, '../../../models'));
// dirs.forEach( (dir) => {
//     if(dir.substring(dir.length -3) === '.js') {
//     models[dir.slice(0, -3)] = require(path.join(__dirname, '../../../models', dir));
//     }
// });

module.exports = {
    route: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if(!req.query.body) req.query.body = {};
        models[req.query.model][req.query.type](req.query.body, (err, data) => {
            if(err) {
                return res.send(JSON.stringify(err));
            }
            if(data.length !== 0) return res.send(JSON.stringify(data));
        });
    },
    path: '/dspTables',
    permissions: 1,
    groups: ['administrators']
};