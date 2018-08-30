const express = require('express'),
  colors = require('colors'),
  app = express(),
  version = "0.0.1-alpha",
  fs = require('fs'),
  path = require('path'),
  URL = require('url-parse'),
  http = require('http'),
  https = require('https'),
  server = http.createServer(app),
  serverSecure = https.createServer(app),
  io = require('socket.io')(server),
  argv = require('yargs').argv,
  port = 2022,
  cookieSession = require('cookie-session'),
  ip = require("ip"),
  templateLoop = require("./controllers/templateLoop.js"),
  config = require('./config/config');


let socketClients = new Object(),


//Express and sockets start script. This uses express.js and socket.io to gather the router/paths and all the socket scripts.  Might be a better way...
 cb = () => {

  if (io && socketClients) {

    let globalObj = { socketClients, io }

    module.exports.socketClients = socketClients;
    module.exports.io = io;

    require('./webServer/express.js')((webServer) => {

      //start express server and then do callback after started (Mocha testing if test argument was provided)
      webServer(config.httpPort, version, server, app, function () {

        if (argv.mochaTest || argv.mocha || argv.test || argv.mochatest) {
          var Mocha = require('mocha'),
            fs = require('fs'),
            path = require('path');

          // Instantiate a Mocha instance.
          var mocha = new Mocha();

          var testDir = 'mochaTest'

          // Add each .js file to the mocha instance
          fs.readdirSync(testDir).filter(function (file) {
            // Only keep the .js files
            return file.substr(-3) === '.js';

          }).forEach(function (file) {
            mocha.addFile(
              path.join(testDir, file)
            );
          });

          // Run the tests.
          mocha.run(function (failures) {
            process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures
            //exit node ( Our script stays open because it has a web server. Need to exit so mocha test is finished...);
            process.exit()
          });
          
        };
      });
    });

    require('./webServer/socket.io').socket(io);

  } else {

    setTimeout(function () { cb(); }, 0);

  }
}

cb();