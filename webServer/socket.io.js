//sockets
const http = require('http'),
  config = require('./../config/config'),
  port = config.httpPort,
  ivId = '26ae5cc854e36b6bdfca366848dea6bb',
  host = 'localhost';

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

  let httpreq = http.request(options, (response) => {

    response.setEncoding('utf8');

    response.on('data', (body) => {

      _callback(body, path);

    });

  });

  httpreq.on('error', (err) => {

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
      credentials: 'same-origin',
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

    response.on('data', (body) => {

      _callback(body);

    });

  });

  httpreq.on('error', (err) => {

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

  let httpreq = http.request(options, (response) => {

    response.setEncoding('utf8');

    response.on('data', (body) => {

      _callback(body);

    });

  });

  httpreq.on('error', (err) => {

  })

  httpreq.write(json);
  httpreq.end();
}

module.exports = {

  socket: (io) => {


    let activeClients = {};

    //sockets

    io.on('connection', (socket) => {

      console.log('clinet connected');
      socket.emit('connected', { connected: 'true' });

      socket.on('login', (data) => {


        postRequest('nojwt', 'http://localhost:3002/user/login', { username: data.form[0], password: data.form[1] }, function (data) {

          var obj = JSON.parse(data);

          if (obj.user) {

            var cookie = require('cookie-signature');

            //create siganture for jwt cookie - push via sockets and have client save cookie.
            var signature = cookie.sign(config.functions.jwtScramble(obj.user._id, obj.user.jwt), config.cookieSecret);

            obj.user.jwt = signature;

            socket.emit('login', obj);
          } else {
            socket.emit('login', obj);
          }
        });


      });

    });

  }
}