const Groups = require("../../models/Groups");

var populate ='';
Object.keys(Groups.schema.obj).forEach(function(key) {
  var val = Groups.schema.obj[key];
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

  find: (query, keys, done) => {

    done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    keys = typeof (keys) === 'function' ? {} : keys;
    query = typeof (query) === 'function' ? {} : query;

    remove$(query);

    Groups.find(query, keys, done)
    .populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate)
    .exec((err, obj) => {
      if (err) done(err);
      done(null, obj);

    })

  },
  findOne: (query, keys, done) => {

    done = typeof (done) !== "undefined" ? done : typeof (query) === 'function' ? query : keys;
    keys = typeof (keys) === 'function' ? {} : keys;
    query = typeof (query) === 'function' ? { _id: 0 } : query;

    remove$(query);

    Groups.findOne(query, keys, done)
    .populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate)
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

    Groups.findById(id, keys, done)
    .populate(typeof (noPopulate) !== "undefined" ? noPopulate : populate)
        // callback function (call exec incase where mongoose variables.)
    .exec((err, obj) => {
        if (err) done(err);
        done(obj);
      }
    );

  }

}

module.exports = read;



