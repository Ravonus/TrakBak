const User = require("../../models/User");


var populate ='';
Object.keys(User.schema.obj).forEach(function(key) {
  var val = User.schema.obj[key];
//  console.log(key)
if (typeof val === 'object' && val[0] && val[0].ref) {
 // console.log(key, typeof val, val[0]);
  populate += ` ${val[0].ref.toLowerCase()}`

}
});
function remove$(query) {
  //loop to add $ in front of mongo/mongoose where commands. This makes it so you don't have to pass it to the object before call.
  Object.keys(query).forEach(function (key) {

    if (typeof (query[key]) === 'object') {
      var oldKey = key;
      Object.keys(query[key]).forEach(function (key) {

        if (key === 'lt' || key === 'lte' || key === 'gt' || key === 'gte' || key === 'in') {
          query[oldKey]['$' + key] = query[oldKey][key];
          delete query[oldKey][key]
          return query;
        }
      });
    }
  });
}

let read = {

  find: async (query, keys, done) => {

    done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    keys = typeof (keys) === 'function' ? {} : keys;
    query = typeof (query) === 'function' ? {} : query;

    remove$(query);


    const user = await User.find(query).populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate).cache(true)
    console.log(user, 'user fags');
    done(null, user);


    // User.find(query, keys, done)
    // .populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate)
    // .exec((err, obj) => {
    //   if (err) return done(err);

    // })

  },
  findOne: (query, keys, done) => {
    done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    keys = typeof (keys) === 'function' ? {} : keys;
    query = typeof (query) === 'function' ? { _id: 0 } : query;

    remove$(query);
    console.log('query DAWG', query);
    var cache = true
    if(keys && keys.cached === false) {
      cache = false;
    }
    console.log(cache);
    User.findOne(query, keys, done).cache(cache)
    .populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate)
        // callback function (call exec incase where mongoose variables.)
    .exec((err, obj) => {
        if (err) return done(err);
      }
    );

  },
  findById: (id, keys, done) => {

    done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    keys = typeof (keys) === 'function' ? {} : keys;
    id = typeof (id) === 'function' ? { _id: 0 } : id;

    User.findById(id, keys, done)
    .populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate).cache(true)
        // callback function (call exec incase where mongoose variables.)
    .exec((err, obj) => {
        if (err) done(err);
      }
    );

  }

}

module.exports = read;



