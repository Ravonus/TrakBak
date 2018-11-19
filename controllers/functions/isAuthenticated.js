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

          config.controllers.User.read.findOne({ query: { _id: decoded.id }, clearCache: true, clientID: decoded.id }, (err, user) => {
         
            if (user && Object.keys(user).length > 0) {
        
              user.passwordHash = undefined;

              delete decoded.id;

              return done(null, Object.assign(decoded, user));

            } else {
              return done('fucc')
            }


          })

        }
      });
    }

  } else if (req.headers && req.headers['x-access-token'] || typeof req === 'string') {


    me(req).then((data) => {

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

    done('notAuthenticated');
    // return done(null, req.userObj)
  }

}