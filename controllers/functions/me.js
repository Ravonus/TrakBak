const config = require('../../config/config'),
cookie = require('cookie-signature');

module.exports = (req) => {

  return new Promise((response, rej) => {

    if (typeof req === 'string') {
      var token = req;
    } else {
 
      var token = cookie.unsign(req.headers['x-access-token'], config.cookieSecret);
      
    }

    var jwtToken = jwtUnScramble(token);

    if (!jwtToken) return rej('noToken')

    jwt.verify(jwtToken, config.jwtSecret, function (err, decoded) {

      if (err) return rej('badToken')

      UserJwt.findOne( { _id: decoded.id }, function (err, user) {


        user.passwordHash = undefined;
        decoded.id = undefined;

        response(Object.assign({ decoded, user }));

        //  done(Object.assign({token:decoded ,user:user._doc}));

      });

    });

  });

}