const config = require('../config/config'),
  http = require('https'),
  cookie = require('cookie-signature'),
  User = require('../webServer/models/User'),
  jwt = require('jsonwebtoken');

const port = config.httpsPort;
const host = config.host;
const ivId = '26ae5cc854e36b6bdfca366848dea6bb',
  rejectUnauthorized = false,
  requestCert = true


  //functions for this page.


  //camelize function.
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }
  


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
  },
  capFirst: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  scopeFunctions: (func) => {
    Object.keys(func).forEach(function (key) {
      global[key] = func[key];
    });
  },

  isAuthenticated: (req, done) => {

    


    if (req.cookies && req.cookies.jwt) {

      var jwtCookie = cookie.unsign(req.cookies.jwt, config.cookieSecret);

      if (jwtCookie) {

        jwtCookie = jwtUnScramble(jwtCookie);

        jwt.verify(jwtCookie.trim(), config.jwtSecret, (err, decoded) => {
          if (err) {
            return done(err);
          } else {
            req.decoded = decoded;

         

            config.controllers.User.read.findOne({ _id: decoded.id }, (err, user) => {


         
              if (err) {
                 return done('fucc');
              } 
             //  console.log(user.passwordHash)
             
               user.passwordHash = undefined;
               
                delete decoded.id;
             //   console.log('is it me', user)
             // console.log(decoded);
                done(null, Object.assign(decoded, user._doc));
              
       

            })

    //             User.findOne(query, keys, done)
    // .populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate)
    //     // callback function (call exec incase where mongoose variables.)
    // .exec((err, obj) => {
    //     if (err) done(err);
    //     console.log('fUUUC')
    //     delete obj.passwordHash;
    //     done(null, obj);
    //   }
    // );


            // User.findOne({ _id: decoded.id }, function (err, user) {

            //   if (!err && !user) return done('fucc');
            //   console.log(user)
            //   delete user._doc.passwordHash;
            //   delete decoded.id;

            //   return done(null, Object.assign(decoded, user._doc));
            // });

          }
        });
      }

    } else if (req.headers['x-access-token']) {
      functions.me(req).then((data) => {
        console.log(data)
        return done(null, data)
      }).catch(err => {
        done(err);
      })
    }
    else {
      req.userObj = {
        _id: 'public',
        name: 'public',
        groups: [{name:'public'}]
      }
      console.log('cry')

      done('notAuthenticated');
     // return done(null, req.userObj)
    }

  },

  me: (req) => {

    return new Promise((response, rej) => {

      var token = cookie.unsign(req.headers['x-access-token'], config.cookieSecret);


      var jwtToken = jwtUnScramble(token);

      console.log(jwtToken)

      if (!jwtToken) return rej('noToken')

      jwt.verify(jwtToken, config.jwtSecret, function (err, decoded) {
        if (err) return rej('badToken')

        User.findOne({ _id: decoded.id }, function (err, user) {
          user.passwordHash = undefined;
          decoded.id = undefined;

          response(Object.assign({ decoded, user }));

          //  done(Object.assign({token:decoded ,user:user._doc}));

        });

      });

    });

  },

  permissions: (num) => {
    // console.log('wtf',isSet);
    return promise = {

      promise: (userObj, policies) => {
        
        //  console.log('cry??' + isSet);
        return new Promise((response, rej) => {
          
          if (policies && policies[Object.keys(policies)].permissions && policies[Object.keys(policies)].permissions > 0 && userObj && userObj.permissions && policies[Object.keys(policies)].active) {
         
            var weight = 0;
            var permission;
            if(typeof policies[Object.keys(policies)].permissions === 'object') {
              weight = policies[Object.keys(policies)].permissions.weight;
              permission = policies[Object.keys(policies)].permissions.value;
            } else {
              permission = policies[Object.keys(policies)].permissions;
            }

            

            function getBinary(num) {

              var binaries = num.toString(2);

              var binaryArray = {}
              for (i = 1; i <= binaries.length; i++) {

                var binary = binaries.substr(binaries.length - i);
                var boolean = !!+binary.charAt(0);
                if (boolean) {

                  var number = '1'.padEnd(i, '0');

                  binaryArray[parseInt(number, 2)] = true;
                }
                if (i === binaries.length) {
                  //    console.log(binaryArray);
                  //   response(binaryArray);
                  return binaryArray;

                }
              }
            }
            var userPerms = getBinary(num);
            var policyPerms = getBinary(permission);

            var promises = [];
            Object.keys(policyPerms).forEach((key, index) => {
           

              if(policies[Object.keys(policies)].match && policies[Object.keys(policies)].groups && policies[Object.keys(policies)].groups.length > 0) {
           
                  var groups = policies[Object.keys(policies)].groups;
                  var userGroups = userObj.groups;
                  var i;
                  for (i = 0; i < userObj.groups.length; i++) { 


                   console.log(userGroups[i].name, 'ppppplllease', groups)

                    if(groups.includes(userGroups[i].name)){
                      console.log('cry')
                      promisePush(userPerms[key]);
                      i = userObj.groups.length + 1;
                    } else {
                      console.log('mah group ', userGroups[i].name, ' real group ', groups)
                    }
                  }
              } else {
                promisePush(userPerms[key])
              }

              function promisePush(perms) {
               
              promises.push(new Promise((response, rej) => {

                if (perms) {
           
                  response('done')
                } else {
                 
                  rej('fucc');
                }

              }));
            }
            
              if (index >= Object.keys(policyPerms).length - 1) {

                console.log('be promsies', promises)
                promise(promises);
              }
            })

            function promise(promises) {

              Promise.all(promises)
                .then(data => {
                  response('true')
                }).catch(err => {
                  console.log('wtd perms')
                  rej('fucc')
                })
            }

          } else {
            response('no perms');
          }
        })

      },

      pf: (done) => {
        if (promise.promise()) {

          console.log(promise.promise())
          return promise.promise().then((data) => {
            return done(null, data)
          }).catch(err => {
            console.log('diz err', err)
            done(err);
          })
        }
      }

    }

  },
  // Options = name,groups,server,model,extras
  createSocket: (socket, route, options) => {

    if(!options) {
      options = {};
    }

    if(!options.server) {
      options.server = config.serverName;
    }

    socket.on(route, (data) => {

          socket.emit(route, data);

          console.log(data);
        
    });

  }, 
  
}

module.exports = functions;