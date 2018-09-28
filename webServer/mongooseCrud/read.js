const modelName = require("../../models/modelName");

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

  find: (query, keys, done) => {

    done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    keys = typeof (keys) === 'function' ? {} : keys;
    query = typeof (query) === 'function' ? {} : query;

    remove$(query);

    modelName.find(query, keys).exec((err, obj) => {
      if (err) done(err);
      done(obj);

    })

  },
  findOne: (query, keys, done) => {

    done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    keys = typeof (keys) === 'function' ? {} : keys;
    query = typeof (query) === 'function' ? { _id: 0 } : query;

    remove$(query);

    modelName.findOne(query, keys)
        // callback function (call exec incase where mongoose variables.)
    .exec((err, obj) => {
        if (err) done(err);
        done(obj);
      }
    );

  },
  findById: (id, keys, done) => {

    done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    keys = typeof (keys) === 'function' ? {} : keys;
    id = typeof (id) === 'function' ? { _id: 0 } : id;

    modelName.findById(id, keys)
        // callback function (call exec incase where mongoose variables.)
    .exec((err, obj) => {
        if (err) done(err);
        done(obj);
      }
    );

  }

}

module.exports = read;



