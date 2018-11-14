const config = require('../config/config'),
  http = require('https')
UserJwt = require('../webServer/models/User'),
  fs = require('fs'),
  jwt = require('jsonwebtoken');

const port = config.httpsPort;
host = config.host,
  ivId = '26ae5cc854e36b6bdfca366848dea6bb',
  rejectUnauthorized = false,
  requestCert = true


//camelize function.
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

global.reverse = (str) => {
  let reversed = "";
  for (var i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

var functions = {

};


fs.readdirSync(__dirname + '/functions').forEach(function (file, index) {

  functions[file.slice(0, -3)] = require(__dirname + '/functions/' + file);

  if (index === fs.readdirSync(__dirname + '/functions').length - 1)
    module.exports = functions;
});




