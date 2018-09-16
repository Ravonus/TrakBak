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
  User = require('./webServer/models/User');
  config = require('./config/config');

  //run template loop script within controllers(Might be able to make a script that finds all controller scripts and runs them... right now only 1 some does not matter.)
require("./controllers/templateLoop.js");

console.log();

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

//passport setup. Setup session  This is the middle where function. Push both app/ and appSecure to setup both servers.

var passportMiddleWare = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  
}

//Run passport middle where for both app and appSecure.
passportMiddleWare(app);
passportMiddleWare(appSecure);


//more passport functions ( So we can use passport middlewhere ontop of routes)
passport.serializeUser((user, done) => {

  
  console.log(user.passwordHash);

  if(!user.passwordHash) {
  var username = user.username;
  var password = user.password;
  var userSet = User.findOne({'name.username': username}, function (err, user){

    if (!user || !user.validPassword(password)) {
      done({ error: "Invalid username/password" });
    } else {
      done({obj: user});
    }
  });
 

  return;
 
  }




  console.log('this is firing still')
  done(null, user._id);

});

passport.deserializeUser(function(userId, done) {
  
  User.findById(userId, (err, user) => done(err, user).then(console.log('ran')));
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

//Express and sockets start script. This uses express.js and socket.io to gather the router/paths and all the socket scripts.  Might be a better way... This can take a minute so created callback. Once variables are found it runs the start web server scripts.
cb = () => {

  if (io && ioS && socketClients) {

    module.exports.socketClients = socketClients;
    module.exports.io = io;

    //this is used to figure out how long the program takes to start.
    module.exports.startTime = startTime;
    
    require('./webServer/express.js')((webServer) => {

      //start express server and then do callback after started (Mocha testing if test argument was provided)
      webServer(config.httpPort, config.version, server, app, () => {

        //this is secure webserver (Same as above but we push the secure server info.)
        webServer(config.httpsPort, config.version, serverSecure, appSecure, () =>{

          //If test was set as argument. Run mocha. (Server won't stay open after test).
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

          //This should be the end of all program start logic. Do anything else at this point. (This callback should be one of the last callbacks. Unless a lot of files need to be read.)

          //Letsencrypt Info (Still working on this script).

          //    require('./config/cert.js');

        });

      });

    });


    // require the socket scripts now that io and ios are finished loading. ()
    require('./webServer/socket.io').socket(ioS);
    require('./webServer/socket.io').socket(io);
  } else {

    setTimeout( () => { cb(); }, 0);

  }
}

cb();

module.exports.app = app;