const modelName = require("../../models/modelName");

let remove = {

  byId: async (options, done) => {

    await cleatCache(options)

    modelName.findByIdAndRemove(options.query,

      // the callback function
      (err, obj) => {
        // Handle any possible database errors
        if (err || obj === null) return done({"fucc":"oh shit dawg"});
        return done(null, Object.assign({ delete: true }, obj._doc));
      }
    )

  },
  byFind: async (options, done) => {

    await clearCache(options);

    modelName.findOneAndRemove(options.query,
      // the callback function
      (err, obj) => {
        // Handle any possible database errors
        if (err || obj === null) return done({"fucc":"oh shit dawg"});
        return done(null, Object.assign({ delete: true }, obj._doc));
      }
    )
  }

}

module.exports = remove;