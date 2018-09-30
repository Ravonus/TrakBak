const modelName = require("../../models/modelName");

let remove = {

  byId: (id, done) => {

    modelName.findByIdAndRemove(id,

      // the callback function
      (err, obj) => {
        // Handle any possible database errors
        if (err || obj === null) return done({"fucc":"oh shit dawg"});
        done(null, Object.assign({ delete: true }, obj._doc));
      }
    )

  },
  byFind: (query, done) => {

    modelName.findOneAndRemove(query,
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