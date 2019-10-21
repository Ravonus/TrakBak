'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
    route: async (req, res) => {

        let dir = path.join(__dirname, `../../dspStatistics/${req.query.name}`);
        let jsons = fs.readdirSync(dir);
        let stats = {}
        await Functions.asyncForEach(jsons, (json) => {
            let file =  fs.readFileSync(`${dir}/${json}`, 'utf8');
            stats = Object.assign(stats, JSON.parse(file));
        });
        res.send(JSON.stringify(stats));
    },
    path: '/dspstatistics',
    type: 'get',
    permissions: 1,
    groups: ['administrators']
}