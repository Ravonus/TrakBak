'use strict';

const bodyParser = require('body-parser');
const hbs = require('hbs');
const express = require('express');
const routes = require('./routes/routes').router,
config = require('./../config/config.js');


var refreshable = require("express-route-refresh");

let started, callback , start;

start = (port, version, server, app, cb) => {


  server.listen(port, () => {

    if(server.cert) {
      console.log(`TrakBak secure `.cyan.bold.underline + `${version}`.yellow.bold + `\n\nServer started on port`.cyan.bold.underline + `:  `.green.bold + `${port}`.yellow.bold + `\n\r`);
    } else {
      console.log(`TrakBak not secure `.cyan.bold.underline + `${version}`.yellow.bold + `\n\nServer started on port`.cyan.bold.underline + `:  `.green.bold + `${port}`.yellow.bold + `\n\r`);
    }

    cb('test');
  });



  app.use(bodyParser.urlencoded({ extended: false }));

  app.set('view engine', 'hbs');
  
  app.set('views', __dirname + '/views');
  hbs.registerPartials(__dirname + '/views/partials');

  app.use(express.static(__dirname + '/shared'));

  if(port === config.httpsPort) {
    app.use(express.static(__dirname + '/securePublic'));

  } else {
    app.use( express.static(__dirname + '/public'));

  }
  
  //set up routes
  app.use('/', routes);


  



}

let webServer = () => {

  started = "started";

  if (typeof callback == 'function') {
    cb('test');
    callback(test);
  }
};

webServer();

module.exports.refresh = function(app) {

  // var refresh_middleware = [
  //   refreshable(app, '/groups')
  // ];

  efreshable(app._rotuer)
  // now /api is registered
 
  // you can refresh just one

    // notice: require is synchronous... so this will be!!
    // refresh_middleware.forEach(function(v) {
    //   v(); // do not send params if you are going to refresh more than one
    // });

    app.use('/refresh', function(req, res, next) {
      // notice: require is synchronous... so this will be!!
      refresh_middleware.forEach(function(v) {
        v(); // do not send params if you are going to refresh more than one
      });
      res.send('ok');
    });

}

// module.exports.refresh = (cb) => {

// }

module.exports.cb = (cb) => {
  if (typeof started != 'undefined') {
    cb(start); // If foo is already define, I don't wait.
  } else {
    callback = cb;
  }
}

