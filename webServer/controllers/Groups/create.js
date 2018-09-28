const Groups = require("../../models/Groups"),
DB = require('../../mongoose');
// Must create key hide system. So people can push keys like when searching and not have it display (Good for data stored in DB that should never be pushed to client.)
function create(obj, keys, done) {
  obj._id = new DB.mongoose.Types.ObjectId();
  const modelObj = new Groups(obj);

  modelObj.save(keys, (err, obj) => {
    if (err) done(err);
    done(obj)

  })

}

module.exports = create;