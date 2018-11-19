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
        //  console.log('DED', deconded)
          config.controllers.User.read.findOne({ query: { _id: decoded.id }, clearCache: true, clientID: decoded.id }, (err, user) => {
         
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
  //  console.log("RUNNN", me)

    me(req).then((data) => {
      console.log("RUNNN")
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