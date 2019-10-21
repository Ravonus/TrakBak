'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
    route: async (req, res) => {
        
        if(req.query && req.query.list) {
            var confFiles = await fs.readdirSync(config.dsp['conf-dir']);

        }

        res.setHeader('Content-Type', 'application/json');
        let stringArray = [];
        await Functions.asyncForEach(confFiles, async (file) => {
            if(file.slice(-5) === '.conf') {
            let contents = await fs.readFile(`${config.dsp['conf-dir']}/${file}`, 'utf8').catch(e => log(e));
            let noComment = contents.replace(/#.*$|^\/\/.*$/gm, '');
            let string = ['breakType:' + file.replace('.conf', '')];
            if (await file.includes('server_message')) {
                string.push(file.replace('.conf', '') + ': ' + noComment);
                stringArray = [...stringArray, ...string];
            } else {
    
                matches = noComment.match(/^(.*?):.*$/gm);
                if (!matches) {
                    matches = [noComment];
                }
                stringArray = [...stringArray, ...string, ...matches];
            }
        }
        });
        return res.send({files:confFiles, contents:stringArray});
    },
    path: '/dspConf',
    type: 'get',
    permissions: 1,
    groups: ['administrators']
}
