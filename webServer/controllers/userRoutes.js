var cookie = require('cookie');

module.exports = {
  createUser: function (req, res, next) {

    // Write responsea
    if (req.headers.cookie) {
   
      let cookies = cookie.parse(req.headers.cookie);

      if (cookies.jwt) {
        req.session.jwt = cookies.jwt;
      }
    }

    //res.end(req.session.views + ' views')

    res.json({test:'test'});
  }
}