const path = require("path");
const public = path.join(__dirname, '../public');
let globalObj = require(path.join(__dirname, '../../', `app.js`)),
socketClients = globalObj.socketClients;
let io = globalObj.io;
var cookie = require('cookie');
var userRoutes = require('./userRoutes');

module.exports = {
  user: userRoutes,
  
  home: function (req, res, next) {

    // Write responsea
    if (req.headers.cookie) {
   
      let cookies = cookie.parse(req.headers.cookie);

      if (cookies.jwt) {
        req.session.jwt = cookies.jwt;
      }
    }

    //res.end(req.session.views + ' views')

    res.render('index.hbs');
  },
  login: function (req, res, next) {

    res.render('login.hbs');
  },
  callback: function (req, res, next) {


    res.sendFile(public + '/callback.html');

    if (socketClients && socketClients[req.query.sid]) {

      Object.keys(socketClients[req.query.sid]).forEach(function (key) {
        //   socketClients[req.query.sid][key];

        if (socketClients[req.query.sid][key] === req.query.cid) {
          io.sockets.to(key).emit('socketClikBak', 'test');
        }

      });

    }

  },
  cbsockets: function (req, res, next) {

    res.sendFile(public + '/sockets.html');

  },
  verify: function (req, res, next) {

    res.sendFile(public + '/verify.html');
  },

  template: function (req, res, next) {
  
    res.send('accepted');
  },
  catchAll: function (req, res, next) {
    res.status(404);
    url = req.url;
    res.render('404.hbs', {title: '404: Page Not Found', url: url });
  }
}