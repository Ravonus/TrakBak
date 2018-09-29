const modelName = require("../../models/modelName");

let remove = {

  byId: (id, done) => {

    modelName.findByIdAndRemove(id,

      // the callback function
      (err, obj) => {
        // Handle any possible database errors
        if (err) done(err);
        done(null, Object.assign({ delete: true }, obj._doc));
      }
    )

  },
  byFind: (query, done) => {

    modelName.findOneAndRemove(query,
      // the callback function
      (err, obj) => {
        // Handle any possible database errors
        if (err) done(err);
        done(null, Object.assign({ delete: true }, obj._doc));
      }
    )
  }

}

module.exports = remove;