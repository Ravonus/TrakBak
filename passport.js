'use strict';

const passport = require("passport"),
app = require('./app'),
User = require('./webServer/models/User'),
jwt = require('jsonwebtoken'),
config = require('./config/config'),
LocalStrategy = require("passport-local").Strategy;

var passportMiddleWare = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  
}

//Run passport middle where for both app and appSecure.
passportMiddleWare(app.app);
passportMiddleWare(app.appSecure);


//more passport functions ( So we can use passport middlewhere ontop of routes)
passport.serializeUser((user, done) => {

  //jwt function to generate token on login


let jwtToken = (id) => {

  // create a token
  let token = jwt.sign({ id: id }, config.jwtSecret, {
    expiresIn: 86400 // expires in 24 hours
  });

  return token;

}

  if(!user.passwordHash) {  var username = user.username;
  var password = user.password;
  User.findOne({'name.username': username}, function (err, user){

    if (!user || !user.validPassword(password)) {
      done({ error: "Invalid username/password" });
    } else {
      user.passwordHash = undefined;
      let newUser = {jwt: jwtToken(user._id)};

      done({user: Object.assign(newUser, user._doc)});
    }
  });
 
  return;
 
  }

  done(null, user._id);

});

passport.deserializeUser(function(userId, done) {
  
  User.findById(userId, (err, user) => done(err, user).then());
});

//setup authentication for passport. This will let us attach passport checks ontop of express route calls.

const local = new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => done(e));
});
passport.use("local", local);

module.exports = passport;