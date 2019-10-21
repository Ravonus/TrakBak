'use strict';

const ip = require('public-ip');

function publicIp() {
return new Promise( async (resolve) => {
    resolve(await ip.v4());
});
}

module.exports = publicIp;