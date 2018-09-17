const express = require('express'),
  colors = require('colors'),
  app = express(),
  appSecure = express(),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  server = http.createServer(app),
  io = require('socket.io')(server),
  argv = require('yargs').argv,
  startTime = Date.now(),
  config = require('./config/config');

//run template loop script within controllers(Might be able to make a script that finds all controller scripts and runs them... right now only 1 some does not matter.)
require("./controllers/templateLoop.js");


// These are options for  secure server ( It needs certificate and key. That is how it becomes secure)
let httpsServerOptions = {
  'key': fs.readFileSync('./webServer/https/key.pem'),
  'cert': fs.readFileSync('./webServer/https/cert.pem')
}

//setup constant for secure server. We can't start it like above because we need the options we created for the secure server
const serverSecure = https.createServer(httpsServerOptions, appSecure),

  // we also need a seperate socket tunnel for the secure server ( Can't use the unsecure one).
  ioS = require('socket.io')(serverSecure);

// we will use this later (it will be object to keep track of tunnels.)
let socketClients = new Object();

//export both app middleware so we can use other files that need it. Such as the passport require right under it.
module.exports.app = app;
module.exports.appSecure = appSecure

//passport setup. Setup session  This is the middle where function. Push both app/ and appSecure to setup both servers.
require('./passport');



//Express and sockets start script. This uses express.js and socket.io to gather the router/paths and all the socket scripts.  Might be a better way... This can take a minute so created callback. Once variables are found it runs the start web server scripts.
cb = () => {

  if (io && ioS && socketClients) {

    module.exports.socketClients = socketClients;
    module.exports.io = io;

    //this is used to figure out how long the program takes to start.
    module.exports.startTime = startTime;

    require('./webServer/express.js')((webServer) => {

      //start express server and then do callback after started (Mocha testing if test argument was provided)
      if (config.httpPort) {
        webServer(config.httpPort, config.version, server, app, () => {

        });
      }
      if (config.httpsPort) {

        //this is secure webserver (Same as above but we push the secure server info.)
        webServer(config.httpsPort, config.version, serverSecure, appSecure, () => {

        });

      }

      //If test was set as argument. Run mocha. (Server won't stay open after test).
      if (argv.mochaTest || argv.mocha || argv.test || argv.mochatest) {
        var Mocha = require('mocha'),
          fs = require('fs'),
          path = require('path');

        // Instantiate a Mocha instance.
        var mocha = new Mocha();

        var testDir = 'mochaTest'

        // Add each .js file to the mocha instance
        fs.readdirSync(testDir).filter((file) => {
          // Only keep the .js files
          return file.substr(-3) === '.js';

        }).forEach((file) => {
          mocha.addFile(
            path.join(testDir, file)
          );
        });

        // Run the tests.
        mocha.run((failures) => {

          process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures

          if (process.exitCode === -1) process.exit(failures);

          //exit node ( Our script stays open because it has a web server. Need to exit so mocha test finishes.)

          console.log('Mocha test '.yellow.bold + 'finished with no errors'.green.bold + '!\n\r'.blue.bold);

          process.exit('success')
        });

      };

      //This should be the end of all program start logic. Do anything else at this point. (This callback should be one of the last callbacks. Unless a lot of files need to be read.)

      //Letsencrypt Info (Still working on this script).

      //    require('./config/cert.js');


    });

    // require the socket scripts now that io and ios are finished loading. ()
    require('./webServer/socket.io').socket(ioS);
    require('./webServer/socket.io').socket(io);
  } else {

    setTimeout(() => { cb(); }, 0);

  }
}

cb();
