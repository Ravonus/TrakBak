'use strict';

const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
async function populationDeep(options, populate) {

  var popDeep = options.deep ? options.deep : populate;

  var popArr = [];

  if (popDeep) {
    try {
      popDeep = JSON.parse(popDeep);
    } catch (e) {

    }

    await Functions.asyncForEach(populate.split(" "), async (pop) => {
      if (pop !== '')

        if (Array.isArray(popDeep[Object.keys(popDeep)[0]])) {
          let newPop = [];
          popDeep[Object.keys(popDeep)[0]].forEach((popAr) => {
            newPop.push({
              path: popAr
            });
          });

          popArr.push({
            path: pop,
            populate: newPop
          });

        } else {

          if (Object.keys(popDeep).includes(pop)) {
            popArr.push({
              path: pop,
              populate: [{
                path: popDeep[pop]
              }]
            });
          } else {
            let select = pop === 'sender' ? '-passwordHash' : undefined;
            popArr.push({
              path: pop,
              select
            });
          }
        }
    });

  }

 

  return popArr;
}

module.exports = {

  m_create: (model) => {

    return async (options, _cb) => {

      if (options) {

        let populate = '';
        if (options.populate && options.populate !== 'false') {
          populate = options.populate;

          delete options.populate;
        }

        var popArr = await populationDeep(options, populate);

        if (options.body) options.query = options.body;
        if (!options.type) options.type = 'create';

        model.lastQuery = options.query;
        if (!_cb) {
          return new Promise(async (resolve, reject) => {
            var data = await model[options.type](options.query).catch(e => {
              return e;
            });
            if (data.errors)
              return reject({
                err: `could not create in ${model.modelName} model. ${data.errmsg ? data.errmsg : data.errors[Object.keys(data.errors)[0]].message}`
              });

            if (popArr.length > 0) {

              await Functions.asyncForEach(popArr, async (pop) => {

                let popRef = model.schema.paths[pop.path].options.ref;

                let poop = await mongoose.models[popRef].m_read({
                  query: data[pop.path],
                  type: 'findById',
                  excludes: options.excludes
                }).catch(e => console.log(e));

                data._doc[pop.path] = poop;

              });
            }

            if (options.socketInfo && options.socketInfo.id && options.socketInfo.room !== undefined) {
              var socket = options.socketInfo;

              _sockets.broadcast(socket.id, {
                room: socket.name ? socket.name : socket.object ? data[socket.object]._id : data._id,
                script: socket.script,
                type: socket.type ? socket.type : 'in'
              }, {
                socket: socket,
                doc: data,
                options: {
                  vue: true
                }
              });
              if (options.client)
                return resolve({
                  socket: true,
                  data: data
                });
            }
            return resolve(data);

          });

        } else {

          model[options.type](options.query, function (err, data) {
            if (err) return _cb({
              err: `could not create in ${model.modelName} model. ${err.errmsg ? err.errmsg : err.errors[Object.keys(err.errors)[0]].message}`
            });
            return _cb(null, data);
          });
        }
      }
    };
  },

  m_read: (model) => {

    let runFunction = model;

    return async (options, _cb) => {

      let emptyKeys = [];

      let populate = '';
      if (options && options.populate && options.populate !== 'false') {
        populate = options.populate;

        delete options.populate;
      }

      var popArr = await populationDeep(options, populate);

      if (!options.query) return;

      options.sort = options.sort ? options.sort : options.query.sort ? options.query.sort : 'createdAt';
      options.direction = options.direction ? options.direction : options.query.direction ? options.query.direction : 'asc';
      if (!options.perPage) options.perPage = 100;
      if (!options.page) options.page = 0;
      if (!options.excludes) options.excludes = '';

      let defaultExcludes = options.login ? ' ' : '-passwordHash -password ';

      if (!options.query && !options.secondary && !options || !options.query && !options.secondary && Object.keys(options).length === 0) options.query = {};
      if (!options.type) options.type = 'find';

      if (options.or) {

        if (options.fillColumns && typeof Number(options.fillColumns) !== 'number') {

          let value = options.query.query;

          options.query = {};

          await Functions.asyncForEach(Object.keys(model.schema.paths), schema => {
            let instance = model.schema.paths[schema].instance;
            options.query[schema] = value;

            if (instance === 'Array') {
              var arInstance = model.schema.paths[schema].caster.instance;
              if (arInstance === 'ObjectID' && !ObjectId.isValid(value)) {
                delete options.query[schema];
              }

            }
            if (instance === 'ObjectID' && !ObjectId.isValid(value)) {
              delete options.query[schema];
            }

            if (instance === 'Date') {
              options.query[schema] = new Date(value);
              if (options.query[schema].toString() === 'Invalid Date') delete options.query[schema];

            }

          });

        }

        let or = {
          $or: []
        };

        await Functions.asyncForEach(Object.keys(options.query), async (value, index) => {
          let noRun = false;
          let promiseAll = [];


          if (!runFunction.schema.paths[value] && value.includes('.')) {
            //    console.log(value, ' Im the rouge!');


            log('rouge-column', [value, model.modelName]);
            let newValue = value.split('.');
            try {

              let modelName = runFunction.schema.paths[newValue[0]].options.ref ? runFunction.schema.paths[newValue[0]].options.ref : runFunction.schema.paths[newValue[0]].options.type[0].ref;
              let search = mongoose.models[modelName].schema.paths[newValue[1]];

              await mongoose.models[modelName].m_read({
                query: {
                  [newValue[1]]: options.query[value]
                },
                or: 't'
              }).catch(e => console.log(e));

            } catch (e) {

              return [];

            }


          }

          if (runFunction.schema.paths[value] && runFunction.schema.paths[value].instance === 'Number') {

            noRun = true;

            if (Number(options.query[value])) {
              options.query[value] = Number(options.query[value]);
              or.$or.push({
                [value]: {
                  $in: Number(options.query[value])
                }
              });
            }

          }

          if (runFunction.schema.paths[value] && runFunction.schema.paths[value].instance === 'ObjectID') {




            if (options.query[value] === 'isEmpty') {
              emptyKeys.push('object');
              or[value] = options.query[value];
            }


            noRun = true
            if (ObjectId.isValid(options.query[value]) || options.query[value].$in) {


              or.$or.push({
                [value]: options.query[value]
              });

            }

          }

          if (runFunction.schema.paths[value] && runFunction.schema.paths[value].instance === 'Array') {

            noRun = true;
            if (options.query[value].$in) {

              or.$or.push({
                [value]: options.query[value]
              });
            } else if (Array.isArray(options.query[value])) {
              await Functions.asyncForEach(options.query[value], (objectId) => {
                if (ObjectId.isValid(objectId)) {

                  or.$or.push({
                    [value]: objectId
                  });
                }

              });

            } else if (options.query[value] !== 'isEmpty') {

              or.$or.push({
                [value]: options.query[value]
              });
            } else {
              emptyKeys.push('array');
              or[value] = options.query[value];
            }

          }

          if (!noRun) {
            let regEx = new RegExp(options.query[value], 'gi');

            if (value !== 'updatedAt')
              or.$or.push({
                [value]: regEx
              });
          }

        });

        options.query = or;

      }

      if (JSON.stringify(options.query).includes('isEmpty')) {

        await Functions.asyncForEach(Object.keys(options.query), (key, index) => {
          if (options.query[key] === 'isEmpty') {

            options.query[key] = emptyKeys[index - 1] === 'object' ? {
              $exists: false
            } : {
              $exists: true,
              $eq: []
            };

          }
        });

      }


      if (JSON.stringify(options.query).includes('notEmpty')) {

        await Functions.asyncForEach(Object.keys(options.query), (key, index) => {
          if (options.query[key] === 'notEmpty') {

            options.query[key] = {
              $gt: []
            };

          }
        });

      }

      console.log(options.query);


      if (!_cb) {
        return new Promise((resolve, reject) => {

          if (options.query.query) options.query = JSON.parse(options.query.query);
          model[options.type](options.query)
            .skip(Number(options.perPage * options.page))
            .limit(Number(options.perPage))
            .sort({
              [options.sort]: options.direction
            })
            .populate(popArr)
            .select(defaultExcludes + options.excludes)
            .exec(async (err, doc) => {
              if (err) {
                //         console.log(err);
                return reject({
                  err: `could not find ${JSON.stringify(options.query)} in ${model.modelName}`
                });
              }

              if (options.searching) {
                doc.searchCount = await eval(model).countDocuments(options.query).catch(e => console.log(e));
                doc.collectionSize = await eval(model).estimatedDocumentCount(options.query).catch(e => console.log(e));
                return resolve(doc);

              } else if (options.count) {

                await eval(model).find({}).estimatedDocumentCount((err, count) => {
                  doc.collectionSize = count;

                  return resolve(doc);

                });
              } else {

                return resolve(doc);
              }

            });

        });

      } else {

        model[options.type](options.query)
          .skip(Number(options.perPage * options.page))
          .limit(Number(options.perPage))
          .sort({
            [options.sort]: options.direction
          })
          .exec(async (err, doc) => {
            if (err) return _cb({
              err: `could not find ${JSON.stringify(options.query)} in ${model.modelName}`
            });
            if (options.count) {

              await model.find({}).estimatedDocumentCount(function (err, count) {
                doc.collectionSize = count;

                return _cb(null, data);

              });
            } else {

              return _cb(null, data);
            }

          });

      }
    }
  },

  m_update: (model) => {

    return (options, _cb) => {

      if (options.body) options.query = options.body;
      if (!options.type) options.type = 'updateOne';
      if (options.push) options.query = {
        $push: options.query
      };

      if (options.pull) options.query = {
        $pullAll: options.query
      };

      if (!_cb) {

        return new Promise((resolve, reject) => {

          console.log(options);

          if (options.where)
            model[options.type](
              options.where,
              options.query, (err, data) => {
                if (err)
                  reject({

                    err: 'Could not update'
                  });
                return resolve({
                  options: data,
                  values: options.query
                });
              });
        });
      } else {
        model[options.type](
          options.where,
          options.query, (err, data) => {
            if (err) return _cb({
              err: 'Could not update'
            });
            return _cb(null, {
              options: data,
              values: options.query
            });
          });
      }

    };

  },

  m_delete: (model) => {
    return (options, _cb) => {

      if (typeof options === 'string') options = {
        where: options
      };
      if (options.where || options.body) options.query = options.where ? options.where : options.body;
      if (!options.type) options.type = 'deleteOne';
      if (!_cb) {
        return new Promise((resolve, reject) => {
          model[options.type](options.query, (err, data) => {
            if (err) return reject({
              err: 'Could not delete'
            });
            return resolve(data);
          });
        });

      } else {

        model[options.type](options.query, (err, data) => {
          if (err) return _cb({
            err: 'Could not delete'
          });
          return _cb(null, data);
        });

      }

    };

  }

};