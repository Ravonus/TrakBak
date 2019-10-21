'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
    route: async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        let dir = path.join(__dirname, '../../../logs/');
        let logList = await fs.readdirSync(dir);
        let logList2 = [];
        if(logList.includes('dsp')){
            Functions.removeA(logList, 'dsp');
            logList2 = await fs.readdirSync(dir+'/dsp');
            for(var i=0;i<logList2.length;i++){
                logList2[i]="dsp-"+logList2[i];
            }
        }
        res.send(JSON.stringify([...logList, ...logList2]));
    },
    path: '/logList',
    type: 'get',
    permissions: 1,
    groups: ['administrators']
}