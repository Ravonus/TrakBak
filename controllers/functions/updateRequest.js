const config = require('../../config/config'),
https = require('https'),
port = config.httpsPort,
rejectUnauthorized = false,
requestCert = true
host = config.host;

updateRequest: (jwt, path, object, _callback) => {

  let json = JSON.stringify(object);

  if (jwt == 'nojwt') {

    let headers = {

      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(json)
    };
    var options = {
      host: 'localhost',
      port,
      path,
      rejectUnauthorized,
      requestCert,
      method: 'PUT',
      headers
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
      rejectUnauthorized,
      requestCert,
      method: 'PUT',
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

  })

  httpsreq.write(json);
  httpsreq.end();
}