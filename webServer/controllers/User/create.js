const User = require("../../models/User"),
DB = require('../../mongoose');
// Must create key hide system. So people can push keys like when searching and not have it display (Good for data stored in DB that should never be pushed to client.)
async function create(options, done) {

  await clearCache(options)
  options.query._id = new DB.mongoose.Types.ObjectId();
  const modelObj = new User(options.query);

  modelObj.save( (err, data) => {

    if (err) return done(err.errors);

    if(options.secondary){
      Object.keys(options.secondary).forEach(function(key) {

       data[key] = undefined;
      
      });
      
    }
      
    return done(null, data)

  })

}

module.exports = create;