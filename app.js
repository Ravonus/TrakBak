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
  tbServer = process.env.cbSocket || ip.address() + ':2022',
  tbServerBack = process.env.cbSocketBack || 'http://' + ip.address() + ':1338';

let socketClients = new Object(),
  templatePath = path.join(__dirname, '/templates'),
  publicPath = path.join(__dirname, '/public/js');

//Read file - Replace all static variables with regex words - Place within public client folder. This function is used within the file loop. Used to look at template files and put correct URL for sockets and API within.
function processFile(myPath, file, word, replace) {

  fs.readFile(templatePath + '/' + file, "utf8", function (err, data) {
    if (err) {
      throw err;
    }


    if (typeof word === 'object') {

      word.forEach((reg, index) => {

        var myRegEx = new RegExp(reg, 'g');

        data = data.replace(myRegEx, replace[index]);

      });

      fs.writeFile(myPath, data, function (err) {
        if (err) {
          return console.log(err);
        }

      });

    } else {

      var myRegEx = new RegExp(word, 'g');
      fs.writeFile(myPath, data.replace(myRegEx, replace), function (err) {
        if (err) {
          return console.log(err);
        }

      });

    }

  });

}

// Loop through all the files in the template directory

fs.readdir(templatePath, function (err, files) {

  if (err) {

    console.error("Could not list the directory.", err);

    process.exit(1);

  }

  files.forEach(function (file, index) {

    // Make one pass and make the file complete

    var fromPath = path.join(templatePath, file);

    var toPath = path.join(publicPath, file);

    fs.stat(fromPath, function (error, stat) {

      if (error) {

        console.error("Error stating file.", error);

        return;

      }

      processFile(toPath, file, ['{{serverBack}}', '{{server}}'], [tbServerBack, tbServer]);

    });

  });

});

//Express and sockets start script. This uses express.js and socket.io to gather the router/paths and all the socket scripts.  Might be a better way...
const cb = () => {

  if (io && socketClients) {

    let globalObj = { socketClients, io }

    module.exports.socketClients = socketClients;
    module.exports.io = io;

    require('./webServer/express.js')((webServer) => {

      //start express server and then do callback after started (Mocha testing if test argument was provided)
      webServer(port, version, server, app, function () {

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