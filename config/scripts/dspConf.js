'use strict';

const fs = require('fs');
const { promisify } = require('util');

global.dspConf = {}

let promises = [];
let found = {};

//fs.readDirSync = promisify(fs.readdir);
try {
if(config.dsp['conf-dir'].substring(config.dsp['conf-dir'].length -1) !=='/' && config.dsp['conf-dir'].substring(config.dsp['conf-dir'].length -1) !=='\\') config.dsp['conf-dir'] = config.dsp['conf-dir']+'/';
var files = fs.readdirSync(config.dsp['conf-dir']);
files.forEach((file, index) => {

    promises.push(new Promise(function (resolve, reject) {

        if (file === 'login_darkstar.conf') {
            found['login_darkstar.conf'] = true;
        } else if (file === 'map_darkstar.conf') {
            found['map_darkstar.conf'] = true;
        } else if (file === 'server_message.conf') {
            found['server_message.conf'] = true;
        } else if (file === 'maint.conf') {
            found['maint.conf'] = true;
        }
        var x;

        if (index === files.length - 1) {
            if ( Object.keys(found).includes('login_darkstar.conf')
                && Object.keys(found).includes('map_darkstar.conf')
                && Object.keys(found).includes('server_message.conf')
                && Object.keys(found).includes('maint.conf')) {
                resolve(file);
            } else {
                reject({ 'err': files })
            }

        } else {
            resolve(file);
        }
    }))

});
} catch (e) {
    log('dspConfNotFound');
}

module.exports = promises;