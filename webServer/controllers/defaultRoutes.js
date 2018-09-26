const path = require("path"),
  public = path.join(__dirname, '../public'),
  globalObj = require(path.join(__dirname, '../../', `app.js`)),
  socketClients = globalObj.socketClients,
  io = globalObj.io,
  cookie = require('cookie-signature'),
  config = require('../../config/config'),
  jwt = require('jsonwebtoken'),
  userRoutes = require('./userRoutes');

module.exports = {
  user: userRoutes,

  home: (req, res, next) => {

    if (req.cookies && req.cookies.jwt) {

      var jwtCookie = cookie.unsign(req.cookies.jwt, config.cookieSecret);

      if (jwtCookie) {

        jwtCookie = config.functions.jwtUnScramble(jwtCookie);

        jwt.verify(jwtCookie.trim(), config.jwtSecret, (err, decoded) => {
          if (err) {
            return next(config.message.render({ res: res, page: 'login.hbs' }));
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded;
            return next(config.message.render({ res: res, page: 'index.hbs' }));

          }

        });
      }

    }

  },
  login: (req, res, next) => {

    if (req.cookies && req.cookies.jwt) {

      var jwtCookie = cookie.unsign(req.cookies.jwt, config.cookieSecret);

      if (jwtCookie) {
        console.log(jwtCookie)
        jwtCookie = config.functions.jwtUnScramble(jwtCookie);
        console.log(jwtCookie);
        var decoded = jwt.verify(jwtCookie.trim(), config.jwtSecret);
      }

    }

    if (req.cookies && req.cookies.jwt && decoded && decoded.id) {
      return next(config.message.redirect({ res: res, page: '/' }));
    } else {

      return next(config.message.redirect({ res: res, page: '/login' }));
    }

  },
  catchAll: (req, res) => {
    res.status(404);
    url = req.url;
    res.render('404.hbs', { title: '404: Page Not Found', url: url });
  }
}