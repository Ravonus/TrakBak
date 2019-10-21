let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(config.vimeo.cid, config.vimeo.secret, config.vimeo.token);

module.exports = async function vimeo(options, body) {

  return new Promise((resolve, reject) => {
    if(body) client = new Vimeo(body.cid, body.secret, body.token);

    console.log('my  line', client);

    client.request({
      method: options.method,
      path: options.path
    }, function (error, body, status_code, headers) {
      if (error) {
        reject(error);
      }

      resolve(body);
    });

  });

};