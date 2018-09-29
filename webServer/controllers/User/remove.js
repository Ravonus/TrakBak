const User = require("../../models/User");

let remove = {
  
  byId: (id, done) => {

    User.findByIdAndRemove(id,
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) done(err);
      done(obj);
      }
  )
  
  },
  byFind: (query, done) => {

    User.findOneAndRemove(query,
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) done(err);
      done(obj);
      }
  )
  }


}

module.exports = remove;