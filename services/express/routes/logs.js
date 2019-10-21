'use strict';

const path = require('path');

module.exports = {
    route: (req, res) => {
        let dir = path.join(__dirname, '../../../logs/', `${req.query.type}.json`)
        res.sendFile(dir);
    },
    path: '/logs',
    type: 'get',
    permissions: 1,
    groups: ['administrators']
}