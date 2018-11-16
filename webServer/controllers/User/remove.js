const User = require("../../models/User");

let remove = {

  byId: async (id, done) => {

    await clearCache(id);
    
    User.findByIdAndRemove(id,

      // the callback function
      (err, obj) => {
        // Handle any possible database errors
        if (err || obj === null) return done({"fucc":"oh shit dawg"});
        done(null, Object.assign({ delete: true }, obj._doc));
      }
    )

  },
  byFind: async (query, done) => {
    await clearCache(query);
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