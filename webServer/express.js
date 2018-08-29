'use strict';

const bodyParser = require('body-parser');
const hbs = require('hbs');
const express = require('express');
const routes = require('./routes');
let started, callback , start;

start = (port, version, server, app, cb) => {

  server.listen(port, () => {
    console.log(`ClikBak Socket and Client Server  `.cyan.bold.underline + `${version}`.yellow.bold + `\n\nServer started on port`.cyan.bold.underline + `:  `.green.bold + `${port}`.yellow.bold);
    cb('test');
  });
  app.use(bodyParser.urlencoded({ extended: false }));

  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');
  hbs.registerPartials(__dirname + '/views/partials');
  app.use(express.static(__dirname + '/public'));

  //set up routes
  app.use('/', routes);

}

function webServer() {


  started = "started";

  if (typeof callback == 'function') {
    cb('test');
    callback(test);
  }
};

webServer();

module.exports = function (cb) {
  if (typeof started != 'undefined') {
    cb(start); // If foo is already define, I don't wait.
  } else {
    callback = cb;
  }
}

