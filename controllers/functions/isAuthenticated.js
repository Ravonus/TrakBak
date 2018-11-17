const config = require('../../config/config'),
  cookie = require('cookie-signature');


  


  


module.exports = (req, done) => {

  if (req.cookies && req.cookies.jwt) {

    var jwtCookie = cookie.unsign(req.cookies.jwt, config.cookieSecret);

    if (jwtCookie) {

      jwtCookie = jwtUnScramble(jwtCookie);

      jwt.verify(jwtCookie.trim(), config.jwtSecret, async (err, decoded) => {

        if (err) {
          return done(err);
        } else {

          req.decoded = decoded;
        //  console.log(config.controllers)
        
          config.controllers.User.read.findOne({ query: { _id: decoded.id }, clearCache: true }, (err, user) => {
            console.log('DIZ USER', user)
         
            if (user && Object.keys(user).length > 0) {

              user.passwordHash = undefined;

              delete decoded.id;

              return done(null, Object.assign(decoded, user));

            } else {
              return done('fucc')
            }

            //  console.log(user.passwordHash)

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