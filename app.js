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
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  startTime = Date.now(),
  config = require('./config/config');

require("./controllers/templateLoop.js");

let httpsServerOptions = {
  'key': fs.readFileSync('./webServer/https/key.pem'),
  'cert': fs.readFileSync('./webServer/https/cert.pem')
}
const serverSecure = https.createServer(httpsServerOptions, appSecure),
  ioS = require('socket.io')(serverSecure);

let socketClients = new Object();

//passport setup. Setup session  This is the middle where function. Push both app/ and appSecure to setup both servers.

function passportMiddleWare(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  
}

passportMiddleWare(app);
passportMiddleWare(appSecure);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId, (err, user) => done(err, user));
});

//setup authentication for passport. This will let us attach passport checks ontop of express route calls.
const local = new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => done(e));
});
passport.use("local", local);

//Express and sockets start script. This uses express.js and socket.io to gather the router/paths and all the socket scripts.  Might be a better way...
cb = () => {

  if (io && ioS && socketClients) {

    module.exports.socketClients = socketClients;
    module.exports.io = io;
    module.exports.startTime = startTime;
    
    require('./webServer/express.js')((webServer) => {

      //start express server and then do callback after started (Mocha testing if test argument was provided)
      webServer(config.httpPort, config.version, server, app, () => {

        //this is secure webserver
        webServer(config.httpsPort, config.version, serverSecure, appSecure, () =>{

          if (argv.mochaTest || argv.mocha || argv.test || argv.mochatest) {
            var Mocha = require('mocha'),
              fs = require('fs'),
              path = require('path');

            // Instantiate a Mocha instance.
            var mocha = new Mocha();

            var testDir = 'mochaTest'

            // Add each .js file to the mocha instance
            fs.readdirSync(testDir).filter( (file) => {
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

              if(process.exitCode === -1) process.exit(failures);

              //exit node ( Our script stays open because it has a web server. Need to exit so mocha test finishes.)

              console.log('Mocha test '.yellow.bold + 'finished with no errors'.green.bold + '!\n\r'.blue.bold);

              process.exit('success')
            });

          };

          //Letsencrypt Info

          //    require('./config/cert.js');

        });

      });

    });

    require('./webServer/socket.io').socket(ioS);
    require('./webServer/socket.io').socket(io);
  } else {

    setTimeout( () => { cb(); }, 0);

  }
}

cb();

module.exports.app = app;