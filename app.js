const express = require('express'),
  colors = require('colors'),
  app = express(),
  appSecure = express(),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  server = http.createServer(app),
  io = require('socket.io')(server),
  cookieParser = require('cookie-parser'),
  argv = require('yargs').argv,
  startTime = Date.now(),
  config = require('./config/config');

  // global.policies = require('./webServer/routes/policies/policies');

  global.trakbak = {
    name: 'trakbak',
    finished: false,
  }

config.controllers = {};





config.functions = require("./controllers/appFunctions");
config.message = require("./controllers/messenger");
let mongCrum = require('./webServer/mongooseCrud/mongooseCrud');

var length = 1;
var oneRun = false;

fs.readdir('./webServer/models/', (err, files) => {
  files.forEach((file) => {

    if (file.substring(file.length - 3) === '.js') { 
      length++ 
    }
    controllerStart();
  });

});


    function controllerStart() {

     

        if (global.trakbak.controllers) {
    

          config.functions.scopeFunctions(config.controllers);
       
        if(oneRun === false) {
          oneRun = true;
        runServer();
        }
          
   

      } else {
        setTimeout(function () { controllerStart(); }, 0);
      }
    
}

config.functions.scopeFunctions(config.functions);
config.functions.scopeFunctions(config.message);



app.use(cookieParser())
appSecure.use(cookieParser())
// These are options for  secure server ( It needs certificate and key. That is how it becomes secure)
let httpsServerOptions = {
  'key': fs.readFileSync('./webServer/https/key.pem', 'ascii'),
  'cert': fs.readFileSync('./webServer/https/cert.pem', 'ascii')
}





//setup constant for secure server. We can't start it like above because we need the options we created for the secure server
const serverSecure = https.createServer(httpsServerOptions, appSecure);

module.exports.secureApp = appSecure;
  

module.exports.app = app;

  // we also need a seperate socket tunnel for the secure server ( Can't use the unsecure one).
  ioS = require('socket.io')(serverSecure);

// we will use this later (it will be object to keep track of tunnels.)
let socketClients = new Object();

//export both app middleware so we can use other files that need it. Such as the passport require right under it.
module.exports.app = app;
module.exports.appSecure = appSecure,
  module.exports.serverSecure = serverSecure;

//passport setup. Setup session  This is the middle where function. Push both app/ and appSecure to setup both servers.
require('./passport');



//Express and sockets start script. This uses express.js and socket.io to gather the router/paths and all the socket scripts.  Might be a better way... This can take a minute so created callback. Once variables are found it runs the start web server scripts.
runServer = () => {

  if (io && ioS && socketClients) {

    module.exports.socketClients = socketClients;
    module.exports.io = io;

    //this is used to figure out how long the program takes to start.
    module.exports.startTime = startTime;

    require('./webServer/express.js').cb((webServer) => {

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


      //This should be the end of all program start logic. Do anything else at this point. (This callback should be one of the last callbacks. Unless a lot of files need to be read.)

      //Letsencrypt Info (Still working on this script).

      //    require('./config/cert.js');


    });

    // require the socket scripts now that io and ios are finished loading. ()
    require('./webServer/sockets/socket.io').socket(ioS);
    require('./webServer/sockets/socket.io').socket(io);
    
    //run template loop script within controllers(Might be able to make a script that finds all controller scripts and runs them... right now only 1 some does not matter.)

  } else {

    setTimeout(() => { runServer(); }, 0);

  }
}