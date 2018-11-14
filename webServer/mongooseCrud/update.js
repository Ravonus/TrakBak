const modelName = require('../../models/modelName');

var update = {
  byId: (id, body, done) => {

    modelName.findByIdAndUpdate(id, body,
  
      
      // an option that asks mongoose to return the updated version 
      // of the document instead of the pre-updated one.
      {new: true},
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) return done(err);
      return done(null, obj);
      }
  )
  
  },
  byFind: (query, body, done) => {

    modelName.findOneAndUpdate(query, body,
  
      
      // an option that asks mongoose to return the updated version 
      // of the document instead of the pre-updated one.
      {new: true},
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) return done(err);
      return done(null, obj);
      }
  )
  }
}

module.exports = update;