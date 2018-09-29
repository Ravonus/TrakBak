const Chackos = require("../../models/Chackos"),
DB = require('../../mongoose');
// Must create key hide system. So people can push keys like when searching and not have it display (Good for data stored in DB that should never be pushed to client.)
function create(obj, keys, done) {
  obj._id = new DB.mongoose.Types.ObjectId();
  const modelObj = new Chackos(obj);

  modelObj.save( (err, data) => {

    
    if (err) return done(err.errors);

    if(keys){
      Object.keys(keys).forEach(function(key) {

       data[key] = undefined;
      
      });
      
    }
      
    return done(null, data)

  })

}

module.exports = create;