const cookie = require('cookie'),
  DB = require('../mongoose');

module.exports = {
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
        else res.redirect("/");
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