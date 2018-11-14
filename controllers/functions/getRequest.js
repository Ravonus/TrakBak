const config = require('../../config/config'),
https = require('https'),
port = config.httpsPort,
rejectUnauthorized = false,
requestCert = true
host = config.host;

module.exports = (jwt, path, _callback) => {

    if (jwt) {
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + jwt
      }
    } else {

      headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    let sendBody;
    var options = {
      host,
      port,
      path,
      rejectUnauthorized,
      requestCert,
      method: 'GET',
      headers
    };

    let httpsreq = https.request(options, (response) => {

      response.setEncoding('utf8');

      response.on('data', (body) => {

        _callback(body, path);

      });

    });

    httpsreq.on('error', (err) => {

    })

    httpsreq.end();

  }