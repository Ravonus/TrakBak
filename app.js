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
  port = 2022,
  cookieSession = require('cookie-session'),
  ip = require("ip"),
  tbServer = process.env.cbSocket || ip.address() + ':2022',
  tbServerBack = process.env.cbSocketBack || 'http://' + ip.address() + ':1338';

let socketClients = new Object(),
    moveFrom = path.join(__dirname, '/templates'),
    moveTo = path.join(__dirname, '/public/js');

//Read file - Replace all static variables with regex words - Place within public client folder.
function processFile(myPath, file, word, replace) {

  fs.readFile(moveFrom+'/'+file, "utf8" , function(err, data) {
    if (err) {
        throw err;
    }


    if(typeof word === 'object') {

      word.forEach( (reg, index) => {

        var myRegEx = new RegExp(reg, 'g');

        data = data.replace(myRegEx,replace[index]);
          
      });

      fs.writeFile(myPath, data, function(err) {
        if(err) {
            return console.log(err);
        }
    
    }); 

    } else {

      var myRegEx = new RegExp(word, 'g');
      fs.writeFile(myPath, data.replace(myRegEx,replace), function(err) {
        if(err) {
            return console.log(err);
        }
    
    }); 

    }
   
  });

}

// Loop through all the files in the temp directory

fs.readdir(moveFrom, function (err, files) {

  if (err) {

    console.error("Could not list the directory.", err);

    process.exit(1);

  }

  files.forEach(function (file, index) {

    // Make one pass and make the file complete

    var fromPath = path.join(moveFrom, file);

    var toPath = path.join(moveTo, file);

    fs.stat(fromPath, function (error, stat) {

      if (error) {

        console.error("Error stating file.", error);

        return;

      }

      if (stat.isFile())

        console.log("'%s' is a file.", fromPath);

      else if (stat.isDirectory())

        console.log("'%s' is a directory.", fromPath);

      
        processFile(toPath, file, ['{{serverBack}}', '{{server}}'], [tbServerBack, tbServer]);
        

      // fs.rename(fromPath, toPath, function (error) {

      //   if (error) {

      //     console.error("File moving error.", error);

      //   }

      //   else {

      //     console.log("Moved file '%s' to '%s'.", fromPath, toPath);

      //   }

      // });

    });

  });

});