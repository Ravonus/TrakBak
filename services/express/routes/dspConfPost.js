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

        let reg = req.body.key.trim() + ':(.*)'
        let re = new RegExp(reg);
        let contents = await fs.readFile(`${config.dsp['conf-dir']}/${req.body.file}.conf`, 'utf8').catch(e => log(e));
        if (req.body.file.includes('server_message')) {
            await fs.writeFileSync(`${config.dsp['conf-dir']}/${req.body.file}.conf`, req.body.value)
        } else {
            let newContents = await contents.replace(re, `${req.body.key.trim()}:\t${req.body.value.trim()}`);
            await fs.writeFileSync(`${config.dsp['conf-dir']}/${req.body.file}.conf`, newContents)
        }
        log('updateConf', [req.body.key, req.body.value, req.body.file], { security: 'high', type: 'success', username: 'main' });
        res.send(req.body);
    },
    path: '/dspConfPost',
    type: 'post',
    permissions: 1,
    groups: ['administrators']

}