const Groups = require("../../models/Groups");

let remove = {
  
  byId: (id, done) => {

    Groups.findByIdAndRemove(id,
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) done(err);
      done(obj);
      }
  )
  
  },
  byFind: (query, done) => {

    Groups.findOneAndRemove(query,
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