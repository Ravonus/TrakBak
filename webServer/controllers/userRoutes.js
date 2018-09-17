const cookie = require('cookie'),
  jwt = require('jsonwebtoken'),
  config = require('../../config/config'),
  User = require('../models/User'),
  DB = require('../mongoose');

module.exports = {

  me: (req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, function (err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

      User.findOne({ _id: decoded.id }, function (err, user) {
        user.passwordHash = undefined;
        res.status(200).send(user);
      });

    });

  },

  login: (req, res) => {

    //setup authentication for passport. This will let us attach passport checks ontop of express route calls.
    req.login({ username: req.body.username, password: req.body.password }, (user) => {


      if (user.error) {
        return res.render('login.hbs');
      }


      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(user));

    });

  },
  createUser: (req, res) => {

    if (req.isUnauthenticated()) {

      let createUser = new DB.User({
        _id: new DB.mongoose.Types.ObjectId(),
        name: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username
        },
        biography: 'Postman post request.',
        password: req.body.password
      })

      createUser.save().then(user => {

        req.login(user, err => {
          if (err) res.render('404.hbs', { title: '404: Page Not Found', url: url });


          res.redirect("/");

        });
      })
        .catch(err => {
          if (err.name === "ValidationError") {
            // req.flash("Sorry, that username is already taken.");
            res.redirect("/register");
          } else res.redirect("/");
        });

    } else {
      res.redirect("/login");
    }

  },
  getUser: (req, res) => {

  },
  updateUser: (req, res) => {

  }
}