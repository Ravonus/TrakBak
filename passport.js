'use strict';

const passport = require("passport"),
app = require('./app'),
User = require('./webServer/models/User'),
jwt = require('jsonwebtoken'),
config = require('./config/config'),
session  = require('express-session'),
LocalStrategy = require("passport-local").Strategy;

let passportMiddleWare = (app) => {

  // app.use(session({
  //   secret:config.jwtSecret,
  //   resave: true,
  //   saveUninitialized: true,
  //   cookie: { secure: false } // Remember to set this
  // }));
  // app.set('trust proxy', 1) 
  app.use(passport.initialize());

  app.use(passport.session())
 
}

//Run passport middle where for both app and appSecure.
passportMiddleWare(app.app);
passportMiddleWare(app.appSecure);

//more passport functions ( So we can use passport middlewhere ontop of routes)
passport.serializeUser((user, done) => {


  if(!user.password) {

    done({ error: "passwordHash" });
  }


  //jwt function to generate token on login


let jwtToken = (obj) => {



  if(obj.jwtExpire){
    console.log(obj.jwtExpire);
  }
  // create a token


  let token = jwt.sign({ id: obj._id }, config.jwtSecret, {

    expiresIn : obj.jwtExpire || config.jwtExpire


  });

  return token;

}

  if(user.password) {
  var username = user.username;
  var password = user.password;
  User.findOne({'name.username': username}, function (err, user){
    
    if (!user || !user.validPassword(password)) {
      console.log(err);
      done({ error: "loginError" });
    } else {
      user.passwordHash = undefined;
      let newUser = {jwt: jwtToken(user)};

      done({user: Object.assign(newUser, user._doc)});
    }
  });
 
  return;
 
  }

  return;
 // done(null, user._id);

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