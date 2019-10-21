'use strict';

const fs = require('fs'),
    path = require('path');

var pathSet = '/';
let page = '/';
let models = {};

module.exports = {
    route: (req, res) => {
        res.render(page, { title: 'title' });
    },
    path: pathSet
}

require('../apiRoutes/bashBuffer');

var apiRoutes = fs.readdirSync(path.join(__dirname, '../', 'apiRoutes/'));

apiRoutes.forEach(file => {
    require(`../apiRoutes/${file}`);
});