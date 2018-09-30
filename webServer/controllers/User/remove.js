const User = require("../../models/User");

let remove = {

  byId: (id, done) => {

    User.findByIdAndRemove(id,

      // the callback function
      (err, obj) => {
        // Handle any possible database errors
        if (err || obj === null) return done({"fucc":"oh shit dawg"});
        done(null, Object.assign({ delete: true }, obj._doc));
      }
    )

  },
  byFind: (query, done) => {

    User.findOneAndRemove(query,
      // the callback function
      (err, obj) => {
        // Handle any possible database errors
        if (err || obj === null) return done({"fucc":"oh shit dawg"});
        done(null, Object.assign({ delete: true }, obj._doc));
      }
    )
  }

}

module.exports = remove;