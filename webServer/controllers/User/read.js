const User = require("../../models/User"),
  { clearHash } = require('../../services/redis');

var populate = '';
Object.keys(User.schema.obj).forEach(function (key) {
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
  //push request needs array. 
  //user.option(User object), options.query(Query for mongoose), options.keys(Extra mongoose options for query like keys), option.type(Type of mongoose request)
  pushRequest: async (options, done) => {

    read[options.type](options, (err, data) => {
      done(err, data)
    })
  },


  find: async (options, done) => {

    remove$(options.query);

    const user = await User.find(options.secondary).populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate).cache(options.clearCache)
    if (user && user.length > 0) {
      done(null, user);
    } else {
      done('fucc')
    }

  },

  findOne: async (options, done) => {

    remove$(options.query);

    if(!options.secondary) {
      options.secondary = {};
    }

    const user = await User.findOne(options.query, options.secondary).populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate).cache(options.clearCache)
    console.log(user);
    if (user && Object.keys(user).length > 0) {
      console.log('da fuc?');
      done(null, user);
    } else {
      done('fucc')
    }

  },
  findById: async (options, done) => {


    const user = await User.findById(options.query, options.secondary).populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate).cache(options.clearCache)
    if (user && user.length > 0) {
      done(null, user);
    } else {
      done('fucc')
    }

  }

}

module.exports = read;