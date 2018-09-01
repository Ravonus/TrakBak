//sockets
const querystring = require('querystring'),
  http = require('http'),
  url = require('url'),
  cookie = require('cookie'),
  path = require('path'),
  fs = require('fs'),
  config = require('./../config/config'),
  port = config.httpPort,
  jwtKey = '00cad614304af8bcc50a77b2b0df46e4',
  ivId = '26ae5cc854e36b6bdfca366848dea6bb',
  host = 'localhost',
  globalObj = require(path.join(__dirname, '../', `app.js`)),

  encryptString = (text, salt) => {

    const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      iv = Buffer.from(ivId, 'hex');

    let cipher = crypto.createCipheriv(algorithm, salt, iv)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  }

decryptString = (text, salt) => {

  const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    iv = Buffer.from(ivId, 'hex');

  try {
    var decipher = crypto.createDecipheriv(algorithm, salt, iv)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  } catch (err) {
    console.log(err);
  }

}

getRequest = (jwt, path, _callback) => {

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
    host: 'localhost',
    port,
    path,
    method: 'GET',
    headers
  };

  let httpreq = http.request(options, function (response) {

    response.setEncoding('utf8');

    response.on('data', function (body) {

      _callback(body, path);

    });

  });

  httpreq.on('error', function (err) {

  })

  httpreq.end();

}

postRequest = (jwt, path, object, _callback) => {

  let json = JSON.stringify(object);

  if (jwt == 'nojwt') {

    let headers = {

      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(json)
    };
    var options = {
      host,
      port,
      path,
      method: 'POST',
      headers
    };

  } else {

    let headers = {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + jwt,
      "Content-Length": Buffer.byteLength(json)
    }
    var options = {
      host: 'localhost',
      port,
      path,
      method: 'POST',
      headers
    };
  };

  let httpreq = http.request(options, (response) => {

    response.setEncoding('utf8');

    response.on('data', function (body) {

      _callback(body);

    });

  });

  httpreq.on('error', function (err) {

  })

  httpreq.write(json);
  httpreq.end();
}

updateRequest = (jwt, path, object, _callback) => {

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
      host: 'localhost',
      port,
      path,
      method: 'PUT',
      headers
    };
  };

  let httpreq = http.request(options, function (response) {

    response.setEncoding('utf8');

    response.on('data', function (body) {

      _callback(body);

    });

  });

  httpreq.on('error', function (err) {

  })

  httpreq.write(json);
  httpreq.end();
}


module.exports = {

  socket: (io) => {


    let activeClients = {};

    //sockets
    console.log('ran')

    io.on('connection', (socket) => {
      
      console.log(socket);
      console.log('clinet connected');
      socket.emit('connected', { connected: 'true' });
     
})

  }
}