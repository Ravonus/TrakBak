const modelName = require("../../models/modelName");

var populate = '';
Object.keys(modelName.schema.obj).forEach(function (key) {
  var val = modelName.schema.obj[key];
  //  console.log(key)
  if (typeof val === 'object' && val[0] && val[0].ref) {
    // console.log(key, typeof val, val[0]);
    populate += ` ${val[0].ref.toLowerCase()}`

  }
});

function sendCallBack(mongoose, done) {

  if (mongoose && Object.keys(mongoose).length > 0) {
    return done(null, mongoose._doc ? mongoose._doc:mongoose);
  } else {
    return done('fucc')
  }
};

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

  find: async (options, done) => {
    // done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    // keys =  (keys) === 'function' ? {} : keys;
    // query = typeof (query) === 'function' ? {} : query;

    remove$(options.query);

    const mongoose = await modelName.find(options.query, options.secondary).populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate).cache(options.clearCache);

    sendCallBack(mongoose, done);

  },
  findOne: async (options, done) => {

    remove$(options.query);

    if (!options.secondary) {
      options.secondary = {};
    }

    const mongoose = await modelName.findOne(options.query, options.secondary).populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate).cache(options.clearCache);

    sendCallBack(mongoose, done);

  },
  findById: async (options, done) => {

    const mongoose = await modelName.findById(options.query, options.secondary).populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate).cache(options.clearCache);
    sendCallBack(mongoose, done);

  }

}

module.exports = read;