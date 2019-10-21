'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
    route: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let dir = path.join(__dirname, '../../dspStatistics/');
        let dspList = await fs.readdirSync(dir);
        let dspDirArr = []
        await Functions.asyncForEach(dspList, (dspDir) => {
            if (fs.lstatSync(dir + dspDir).isDirectory()) dspDirArr.push(dspDir)
        });

        res.send(JSON.stringify(dspDirArr));
    },
    path: '/dspList',
    type: 'get',
    permissions: 1,
    groups: ['administrators']
}