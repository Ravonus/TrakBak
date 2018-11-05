const config = require('../../config/config'),
https = require('https'),
port = config.httpsPort,
rejectUnauthorized = false,
requestCert = true
host = config.host;

module.exports =   (jwt, path, object, _callback) => {

    console.log('ranz', host, port, path)

    let json = JSON.stringify(object);

    if (jwt == 'nojwt') {

      let headers = {

        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json)
      };
      var options = {
        credentials: 'same-origin',
        host,
        port,
        path,
        method: 'POST',
        headers,
        rejectUnauthorized,
        requestCert,
      };

    } else {

      let headers = {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + jwt,
        "Content-Length": Buffer.byteLength(json)
      }
      var options = {
        host,
        port,
        path,
        method: 'POST',
        headers
      };
    };

    let httpsreq = https.request(options, (response) => {

      response.setEncoding('utf8');

      response.on('data', (body) => {

        _callback(body);

      });

    });

    httpsreq.on('error', (err) => {

      console.log(err)

    })

    httpsreq.write(json);
    httpsreq.end();
  }