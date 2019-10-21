'use strict';

const path = require('path');
const fs = require('fs');

let models = {};

// let dirs = fs.readdirSync(path.join(__dirname, '../../../models'));
// dirs.forEach((dir) => {
//     if(dir.substring(dir.length -3) === '.js') {
//     models[dir.slice(0, -3)] = require(path.join(__dirname, '../../../models', dir));
//     }
// });

module.exports = {
    route: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        models[req.body.model].delete(req.body.where, (err, data) => {

            if (err) return res.send(JSON.stringify({ err: err }));

            return res.send(JSON.stringify(req.body.where));
        })

    },
    path: '/dspDelete',
    type: 'delete',
    permissions: 1,
    groups: ['administrators']
}
