//sockets
const querystring = require('querystring'),
  http = require('http'),
  url = require('url'),
  cookie = require('cookie'),
  path = require('path'),
  fs = require('fs'),
  port = 1338,
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

    io.on('connection', (client) => {

      var url_parts = url.parse(client.handshake.headers.referer, true);

      if (client.handshake.query.id && !globalObj.socketClients[client.handshake.query.id] || globalObj.socketClients[client.handshake.query.id] && !globalObj.socketClients[client.handshake.query.id][client.id]) {

        getRequest(undefined, '/sockets/' + client.handshake.query.id, (body) => {

          let domainFound = false;
          let pathFound = false;

          if (JSON.parse(body).domains) {

            for (var domain of JSON.parse(body).domains) {

              if (domain.name === url_parts.hostname) {

                domainFound = true;

                break;

              }
            }
          }
          if (JSON.parse(body).paths) {

            for (var path of JSON.parse(body).paths) {

              if (path.path === url_parts.pathname) {

                pathFound = true;
                break;

              }
            }
          }

          if (domainFound && pathFound) {

            if (globalObj.socketClients && !globalObj.socketClients[client.handshake.query.id]) {

              globalObj.socketClients[client.handshake.query.id] = {}

              if (client.handshake.query.GA && client.handshake.query.GAua !== 'disabled') {

                globalObj.socketClients[client.handshake.query.id][client.id] = client.handshake.query.GA;
                client.join(client.handshake.query.id);
              } else {

                if (url_parts.query.cid)
                  globalObj.socketClients[client.handshake.query.id][client.id] = url_parts.query.cid;
                client.join(client.handshake.query.id);
              }

            } else {

              if (client.handshake.query.GA && client.handshake.query.GAua !== 'disabled') {
                globalObj.socketClients[client.handshake.query.id][client.id] = client.handshake.query.GA;
                client.join(client.handshake.query.id);

              } else {

                if (url_parts.query.cid)
                  globalObj.socketClients[client.handshake.query.id][client.id] = url_parts.query.cid;
                client.join(client.handshake.query.id);
              }
            }

          } else {

            console.log('THY DISCONNECTED');
            //uncomment when ready to put exception here for clikbak connection (Right now main LP is being DC)
            // client.disconnect(client.id);

          }

        });

      }

      client.on('disconnect', (data) => {

        if (globalObj.socketClients) {

          Object.keys(globalObj.socketClients).forEach(function (key) {

            if (globalObj.socketClients[key][client.id]) {
              client.broadcast.to(key).emit('allReload', 'sendAll');
              client.leave(key);
              delete globalObj.socketClients[key][client.id];
            }

          });

        }
      });

      client.on('socketUpdate', function (data) {

        console.log('test')

        updateRequest(decryptString(data.jwt, jwtKey), '/sockets/' + data.socketId, { [data.type]: data.data }, (body) => {

          client.emit('socketUpdate', data.closeChip)

        });

      });

      client.on('createDomain', function (data) {

        postRequest(decryptString(data.jwt, jwtKey), '/domains', data.object, (body) => {

          client.emit('createDomain', { msg: body })

        });

      });

      client.on('createLP', function (data) {

        postRequest(decryptString(data.jwt, jwtKey), '/paths', data.object, (body) => {

          client.emit('createLP', { msg: body })

        });

      });

      client.on('viewScripts', function (data) {

        getRequest(decryptString(data.jwt, jwtKey), '/scripts', (body) => {

          scripts = [];
          JSON.parse(body).forEach((script) => {

            var scriptObj = {};

            if (scripts.sockets || script.sockets.length > 0) {
              scriptObj.sockets = []
              script.sockets.forEach((socket) => {

                scriptObj.sockets.push({ name: socket.name, type: socket.type })

              });
            }
            scriptObj.scriptName = script.name;
            scriptObj.scriptEnabled = script.enabled;

            if (script.sockets.length > 0) {

              scriptObj.socketName = script.sockets[0].name;
              scriptObj.socketEnabled = script.sockets[0].enabled;
              scriptObj.socketType = script.sockets[0].type;

            }

            scripts.push(scriptObj);

          })

          client.emit('viewScripts', {

            scripts

          });

        });

      });

      client.on('register', function (data) {

        if (data.form.length !== 0) {

          var data2 = querystring.stringify({
            username: data.form[2].value || undefined,
            firstName: data.form[0].value || undefined,
            lastName: data.form[1].value || undefined,
            password: data.form[3].value || undefined,
            email: data.form[2].value,
            formId: data.formId

          });

          var options = {

            host: 'localhost',
            port: 1338,
            body: data,
            path: '/auth/local/register',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(data2)
            }
          };

          var httpreq = http.request(options, function (response) {

            response.setEncoding('utf8');
            response.on('data', function (body) {

              client.emit('postData', {
                msg: body
              });

            });

          });
          httpreq.on('error', function (err) {

            console.log(err);

          })
          httpreq.write(data2);
          httpreq.end();
        }

      });

      client.on('verify', function (data) {

        if (data.key) {

          var path = '/registrationkey/' + data.key

          getRequest(undefined, path, (body) => {

            if (body.includes('err')) {

              path = '/user/' + JSON.parse(body).id;

              getRequest(undefined, path, (body) => {

                client.emit('verify', {

                  err: body

                });

                return;

              });

            } else {

              client.emit('verify', {

                msg: body
              });
            }

          });

        }
      });
      client.on('me', function (data) {

        getRequest(decryptString(data.jwt, jwtKey), '/user/me', (body) => {
          client.emit('me', {
            msg: body
          });

        });
      });

      client.on('saveScript', function (data) {

        getRequest(decryptString(data.jwt, jwtKey), '/user/me', (body) => {

          if (JSON.parse(body)._id === data.id) {

            fs.readFile(`${__dirname}/public/js/${data.id}/${data.script}.js`, "utf8", function read(err, content) {
              if (err) {
                throw err;
              }

              function escapeRegExp(str) {
                return str.replace(/[\(\)\*]/g, "\\$&");
              }

              var myRegEx = new RegExp(escapeRegExp(data.regEx), 'i');

              var myContent = content.replace(myRegEx, data.text);

              fs.writeFile(`${__dirname}/public/js/${data.id}/${data.script}.js`, myContent, (err) => {
                if (err) throw err;

              });
              client.emit('saveScript', {

              });

            });

          }

        });
      });

      client.on('socketCreate', function (data) {
        data.object.enabled = true;
        postRequest(decryptString(data.jwt, jwtKey), '/sockets', data.object, (body) => {

          client.emit('socketCreate', JSON.parse(body)._id);

        })
      });

      client.on('createScript', function (data) {

        let server = 'https://cp.clikbak.com';
        var obj = { name: data.template.name, sockets: data.template.socketScripts, enabled: 1 };
        postRequest(decryptString(data.jwt, jwtKey), '/scripts', obj, (body) => {

          if (body.statusCode) {

            return;
          }

          fs.readFile(path.join(__dirname, '../templates/', `${data.template.template}.js`), "utf8", function read(err, content) {
            if (err) {
              console.log(err);
            }

            var myRegEx = new RegExp('{{server}}', 'g');

            if (content) {
              let fileContent = content.replace(myRegEx, server);

              var myRegEx = new RegExp('{{id}}', 'g');

              fileContent = fileContent.replace(myRegEx, data.template.socketScripts[0]);

              if (!fs.existsSync(`${__dirname}/public/js/${data.template.id}`)) {
                fs.mkdirSync(`${__dirname}/public/js/${data.template.id}`);
              }
              fs.writeFile(`${__dirname}/public/js/${data.template.id}/${data.template.name}.js`, fileContent, (err) => {
                if (err) throw err;

              });

            }

          });

        });
      });

      client.on('selectClikbakSocket', function (data) {

        getRequest(decryptString(data.jwt, jwtKey), '/sockets?type=clikbak&enabled=1', (body) => {

          client.emit('selectClikbakSocket', {
            msg: body
          });

        });

      });

      client.on('selectSocket', function (data) {

        // console.log(data.row);

        let sendData = [];
        let x = 0;
        data.pages.forEach((selectList) => {

          let finished = () => {
            x++;
            if (x === data.pages.length) {

              let msg = {};
              Object.keys(sendData).forEach(function (key) {

                if (!msg[key]) {
                  msg[key] = sendData[key];
                }
              });

              msg.row = data.row;
              client.emit('selectSocket', msg);
            }
          }

          console.log(selectList);
          getRequest(decryptString(data.jwt, jwtKey), '/' + selectList, (body, page) => {
            page = page.slice(1);
            if (!JSON.parse(body).message) {

              JSON.parse(body).forEach((obj) => {

                if (!sendData[page]) {

                  sendData[page] = [{
                    id: obj._id,
                    name: obj.name
                  }];
                } else {

                  sendData[page].push({
                    id: obj._id,
                    name: obj.name
                  });
                }

              })
            }
            finished();

          });

        });

      });

      client.on('login', function (data) {

        if (data && data.form) {

          var json = querystring.stringify({
            identifier: data.form[0].value,
            password: data.form[1].value
          });

          var options = {
            host: 'localhost',
            port: 1338,
            body: data,
            path: '/auth/local/',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(json)
            }
          };

          let httpreq = http.request(options, (response) => {

            response.setEncoding('utf8');
            response.on('data', function (body) {

              let replaceBody = JSON.parse(body);
              if (!replaceBody.statusCode) {
                replaceBody.jwt = encryptString(JSON.parse(body).jwt, jwtKey);
              }
              body = JSON.stringify(replaceBody);
              client.emit('login', {
                msg: body
              });
              //    res.send(body);
            });

          });
          httpreq.on('error', function (err) {
            console.log(err);

          });

          httpreq.write(json);
          httpreq.end();

        }
      });
    });
  }
}