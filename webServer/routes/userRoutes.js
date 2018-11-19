const cookie = require('cookie'),
  jwt = require('jsonwebtoken'),
  config = require('../../config/config'),
  User = require('../models/User');
  DB = require('../mongoose');

module.exports = {

  me: (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) return next(apiError({ res: res, type: 'noToken', statusCode: 401 }))

    jwt.verify(token, config.jwtSecret, function (err, decoded) {
      if (err) return next(apiError({ res: res, type: 'badToken', statusCode: 500 }))

      User.findOne({ _id: decoded.id }, function (err, user) {
        user.passwordHash = undefined;
        decoded.id = undefined;
        res.status(200).send(Object.assign(decoded, user._doc));
      });

    });

  },

  login: (req, res, next) => {

    //setup authentication for passport. This will let us attach passport checks ontop of express route calls.

    if(req.body && !req.body.username && req.body['name.username']) {
      req.body.username = req.body['name.username'];
    }

    req.login({ username: req.body.username, password: req.body.password }, (user) => {

      if (user.error) {

        return next(apiError({ res: res, type: user.error, statusCode: 401 }))

      } else {

        res.status(200).send(user);
      }

    });

  },

  getUser: (req, res) => {

  },
  updateUser: (req, res) => {

  }
}