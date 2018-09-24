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
        decoded.id = undefined;
        res.status(200).send(Object.assign(decoded, user._doc));
      });

    });

  },

  login: (req, res) => {

    //setup authentication for passport. This will let us attach passport checks ontop of express route calls.
    req.login({ username: req.body.username, password: req.body.password }, (user) => {

   //   var user = user.user;


    //  res.setHeader('Content-Type', 'application/json');
      if (user.error) {
        //  return res.render('login.hbs');
        console.log(user.error);
    //    res.sendStatus(500).send({error:user.error});

    res.send({error:user.error});

        } else {
          res.send(JSON.stringify(user));
        }

      

      // res.setHeader('Content-Type', 'application/json');
      // res.send(JSON.stringify(user));

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

      console.log(createUser);

      createUser.save().then(user => {

        console.log('ranzz');
   

        req.login(user, err => {
          if (err) res.render('404.hbs', { title: '404: Page Not Found', url: url });

          res.redirect("/");

        });
      })
        .catch(err => {
          console.log('ran');
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