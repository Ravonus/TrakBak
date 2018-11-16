const User = require('../../models/User');




var update = {
  byId: async (options, done) => {

    await clearCache(options);
    
    User.findByIdAndUpdate(options.query, options.secondary,
  
      
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
  
  },
  byFind: async (options, done) => {

    await clearCache(options);
    
    User.findOneAndUpdate(options.query, options.secondary,
  
      
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