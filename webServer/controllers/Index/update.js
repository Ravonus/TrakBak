const Index = require('../../models/Index');

var update = {
  byId: (id, body, done) => {

    Index.findByIdAndUpdate(id, body,
  
      
      // an option that asks mongoose to return the updated version 
      // of the document instead of the pre-updated one.
      {new: true},
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) return done(err);
      done(null, obj);
      }
  )
  
  },
  byFind: (query, body, done) => {

    Index.findOneAndUpdate(query, body,
  
      
      // an option that asks mongoose to return the updated version 
      // of the document instead of the pre-updated one.
      {new: true},
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) return done(err);
      done(null, obj);
      }
  )
  }
}

module.exports = update;