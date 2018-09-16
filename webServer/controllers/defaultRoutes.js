const path = require("path"),
  public = path.join(__dirname, '../public'),
  globalObj = require(path.join(__dirname, '../../', `app.js`)),
  socketClients = globalObj.socketClients,
  io = globalObj.io,
  cookie = require('cookie'),
  userRoutes = require('./userRoutes');

module.exports = {
  user: userRoutes,

  home: function (req, res) {


    if(req.isAuthenticated()) {
      res.render('index.hbs');
    } else {

      res.render('login.hbs');
    }
    

    // // Write responsea
    // if (req.headers.cookie) {

    //   let cookies = cookie.parse(req.headers.cookie);

    //   if (cookies.jwt) {
    //     req.session.jwt = cookies.jwt;
    //   }
    // }

  },
  login: function (req, res) {

    if(req.isUnauthenticated()) {
      res.render('login.hbs');
    } else {
      res.render('index.hbs');
    }
    
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
    res.render('404.hbs', { title: '404: Page Not Found', url: url });
  }
}