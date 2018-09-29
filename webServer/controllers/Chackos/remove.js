const Chackos = require("../../models/Chackos");

let remove = {
  
  byId: (id, done) => {

    Chackos.findByIdAndRemove(id,
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) done(err);
      done(null, Object.assign({ delete: true }, obj._doc));
      }
  )
  
  },
  byFind: (query, done) => {

    Chackos.findOneAndRemove(query,
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