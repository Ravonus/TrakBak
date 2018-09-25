const config = require('../config/configNoFunc'),
  http = require('https');

const port = config.httpsPort;
const host = config.host;
const ivId = '26ae5cc854e36b6bdfca366848dea6bb',
rejectUnauthorized =  false,
requestCert = true

var functions = {

  reverse: (str) => {
    let reversed = "";
    for (var i = str.length - 1; i >= 0; i--) {
      reversed += str[i];
    }
    return reversed;
  },

  jwtScramble: (id, token) => {

    token = functions.reverse(token);
    var idArr = id.match(/.{0,4}/g);
    var tokenArr = token.match(/.{0,4}/g);
    idArr.forEach(function (split, index) {

      console.log(index);
      tokenArr[index] = tokenArr[index] + split;
    })

    token = tokenArr.join();

    return token.replace(/,/g, '');

  },

  jwtUnScramble: (token) => {

    var tokenArr = token.match(/.{0,8}/g);
    var newToken = '';
    for (i = 0; i < 7; i++) {
      if (i !== 6) {

        newToken += tokenArr[i].substring(0, tokenArr[i].length - 4);;

      } else {

        for (x = 6; x < tokenArr.length; x++) {
          newToken += tokenArr[x];

        }
      }

    }

    return functions.reverse(newToken);

  },

  encryptString: (text, salt) => {

    const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      iv = Buffer.from(ivId, 'hex');

    let cipher = crypto.createCipheriv(algorithm, salt, iv)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  },

  decryptString: (text, salt) => {

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

  },
  getRequest: (jwt, path, _callback) => {

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

    let httpreq = http.request(options, (response) => {

      response.setEncoding('utf8');

      response.on('data', (body) => {

        _callback(body, path);

      });

    });

    httpreq.on('error', (err) => {

    })

    httpreq.end();

  },

  postRequest: (jwt, path, object, _callback) => {

    console.log('ran')

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

    let httpreq = http.request(options, (response) => {

      response.setEncoding('utf8');

      response.on('data', (body) => {

        _callback(body);

      });

    });

    httpreq.on('error', (err) => {

      console.log(err)

    })

    httpreq.write(json);
    httpreq.end();
  },

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

  //Auto Functions//

  //End Auto Functions//
}

module.exports = functions;