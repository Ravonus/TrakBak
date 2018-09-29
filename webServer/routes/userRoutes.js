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
    req.login({ username: req.body.username, password: req.body.password }, (user) => {


      if (user.error) {


        console.log(user.error)

        return next(apiError({ res: res, type: user.error, statusCode: 401 }))

      } else {

        res.status(200).send(user);
      }

    });

  },
  createUser: (req, res, next) => {


  

      let createUser = new DB.User({
        _id: new DB.mongoose.Types.ObjectId(),
        name: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username
        },
        biography: 'Postman post request.',
        password: req.body.password,
        groups: req.body.groups
      })

      createUser.save().then(user => {
        user._doc.passwordHash = undefined;
        res.status(200).send(Object.assign({ created: true }, user._doc));

      })
        .catch(err => {

          var key = Object.keys(err.errors)[Object.keys(err.errors).length - 1];

          if (err.name === "ValidationError") {

            return next(apiError({ res: res, type: err.errors[key].path, statusCode: 500 }))

          }
        });


  },
  getUser: (req, res) => {

  },
  updateUser: (req, res) => {

  }
}