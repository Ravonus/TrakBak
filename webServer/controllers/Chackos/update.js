const Chackos = require('../../models/Chackos');

var update = {
  byId: (id, body, done) => {

    Chackos.findByIdAndUpdate(id, body,
  
      
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

    Chackos.findOneAndUpdate(query, body,
  
      
      // an option that asks mongoose to return the updated version 
      // of the document instead of the pre-updated one.
      {new: true},
      
      // the callback function
      (err, obj) => {
      // Handle any possible database errors
      if (err) done(err);
      done(null, obj);
      }
  )
  }
}

module.exports = update;