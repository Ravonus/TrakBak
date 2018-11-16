const config = require('../../config/config'),
cookie = require('cookie-signature');

module.exports = (req, done) => {

  if (req.cookies && req.cookies.jwt) {

    

    var jwtCookie = cookie.unsign(req.cookies.jwt, config.cookieSecret);

    if (jwtCookie) {

      jwtCookie = jwtUnScramble(jwtCookie);

      jwt.verify(jwtCookie.trim(), config.jwtSecret, (err, decoded) => {
   
        if (err) {
          return done(err);
        } else {
          
          req.decoded = decoded;
          config.controllers.User.read.findOne({ _id: decoded.id },{cached:false}, (err, user) => {
            console.log('hrrm')
            console.log(err);
            if (err) {
              return done('fucc');
            }
            //  console.log(user.passwordHash)

            user.passwordHash = undefined;

            delete decoded.id;
         
            return done(null, Object.assign(decoded, user._doc));

          })

        }
      });
    }

  } else if (req.headers && req.headers['x-access-token'] || typeof req === 'string') {
    functions.me(req).then((data) => {
   
      return done(null, data)
    }).catch(err => {
      done(err);
    })
  }
  else {
    req.userObj = {
      _id: 'public',
      name: 'public',
      groups: [{ name: 'public' }]
    }
    console.log('cry')

    done('notAuthenticated');
    // return done(null, req.userObj)
  }

}