const User = require("../../models/User"),
DB = require('../../mongoose');

function create(obj, keys, done) {
  obj._id = new DB.mongoose.Types.ObjectId();
  const modelObj = new User(obj);

  modelObj.save(keys, (err, obj) => {
    if (err) done(err);
    done(obj)

  })

}

module.exports = create;