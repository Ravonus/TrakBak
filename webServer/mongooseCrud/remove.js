const modelName = require("../../models/modelName");

let remove = {
  
  byId: (id, done) => {

    modelName.findByIdAndRemove(id,
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) done(err);
      done(obj);
      }
  )
  
  },
  byFind: (query, done) => {

    modelName.findOneAndRemove(query,
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