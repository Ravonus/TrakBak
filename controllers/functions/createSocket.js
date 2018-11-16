/*
 * Project: trakbak
 * File Created: Tuesday, 13th November 2018 8:50:14 pm
 * Author: Chad Koslovsky (chad@technomancyIT.com)
 * -----
 * Last Modified: Tuesday, 13th November 2018 9:53:25 pm
 * Modified By: Chad Koslovsky (chad@technomancyIT.com>)
 * -----
 * Copyright 2018 - 2018 - TechnomancyIT
 */

const config = require('../../config/config');
Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

module.exports = (socket, route, object, user, functions, options) => {

  if (!socket._events || socket._events && !socket._events[route]) {

    socket.on(route, (data) => {

      var oldOptions;

      if (data && data.data) {

        if (typeof data.data === 'object') {

          if (route.indexOf("Create") === 4) {
            options = Object.assign(options, { body: data.data });
          } else {
            options = Object.assign(options, data.data);
          }

        } else {

          options = Object.assign(options, { value: data.data, type: "findOne" });

        }

      } else {
        delete options.value;
        options.type = 'find';
      }

      var promises = [];

      if (!options.server) {
        options.server = config.serverName;
      }


      if (object.isAuthenticated) {

        promises.push(new Promise((resolve, reject) => {

          if (user && user !== '0') {

            return resolve(user);
          }

          user = '0';
          reject({ group: 'public' });

        }));
      } else {
        user = { name: 'public' }
        promises.push(new Promise((resolve, reject) => {
          resolve(user);
        }));
      }

      var array = object.policies.filter(function (el) {
        return el != null;
      });


      if (object.permissions && object.permissions > 0) {

        promises.push(config.functions.permissions(user.permissions).promise(user, object, 'sockets'));
      }


      if (Object.keys(array).length > 0) {

        array.forEach((policy, index) => {

          var myPolicy = policy[Object.keys(policy)];

          if (!myPolicy.match || myPolicy.match.length === 0) {
            myPolicy.match = [];
          }

          if (!myPolicy.groups || myPolicy.groups.length === 0) {
            myPolicy.groups = [];
          }


          if (myPolicy.match.length > 0) {
            myPolicy.match.forEach((match, index) => {
              if (myPolicy.groups.length > 0 && myPolicy.groups.includes(match)) {
                runPromise();
                myPolicy.groups.remove(match);

                if (index === myPolicy.match.length - 1) {
                  myPolicy.groups = [...myPolicy.groups, ...myPolicy.match];
                }
              }
            })
          } else {
            runPromise();
          }

          function runPromise() {

            promises.push(new Promise((resolve, reject) => {

              functions[Object.keys(policy)]({ userObj: { [user]: '0' } }, (err, data) => {

                if (err) {
                  return reject(err)
                }
                resolve(data);

              })

            }));

          }

          promises.push(config.functions.permissions(user.permissions).promise(user, policy, 'sockets'));

          var obj = policy[Object.keys(policy)];

          if (obj && obj.sockets || obj && obj.sockets === undefined) {

            if (!obj.groups) {
              obj.groups = [];
            }
            if (!options.groups) {
              options.groups = [];
            }

            var groups = [...options.groups, ...obj.groups]

            if (!obj.permissions) {
              obj.permissions = 0;
            }
            if (!options.permissions) {
              options.permissions = 0;
            }

            var permissions = options.permissions + obj.permissions;

          }

          if (index === array.length - 1) {

            promisesRun()
          }

        });
      } else {
        promisesRun()
      }

      function promisesRun() {

        if (promises.length > 0) {
          Promise.all(promises).then(data => {
            // var secondary;
            // var query = {};
            var controller = route.split(/(?=[A-Z])/);
            var modelFunction = config.controllers[capFirst(controller[0])]
            var controllerName = controller[1].toLowerCase();
            var functionIndex = Object.keys(modelFunction[controllerName])[0];

            if (options && options.type) {
              //  console.log(options);
              functionIndex = options.type
              var query = options.value ? options.value : options.id ? options.id : {};
              var secondary = options.keys ? options.keys : options.body ? options.body : {};
              

              // console.log('diz secondary', secondary);

              // switch (functionIndex) {
              //   case 'find':

              //     break;
              //   case 'findOne':

              //     break;
              //   case 'findById':

              //     query = options.value ? options.value : options.id ? options.id : options._id
              //     secondary = options.keys ? options.keys : options.body ? options.body : null;

              //     break;
              //   case 'byId':
              //     query = options.value ? options.value : options.id ? options.id : options._id;
              //     secondary = options.keys ? options.keys : options.body ? options.body : null;
              //     break;
              //   case 'byFind':

              //     break;
              //   default:

              // }

              if (!modelFunction[controllerName][functionIndex]) {
                functionIndex = Object.keys(modelFunction[controllerName])[0];

              }
            }
            console.log(controllerName, functionIndex, options);
            if (controllerName === 'read') {

              socketEmit(query, secondary, route, controllerName, functionIndex);

            } else if (controllerName === 'remove' || controllerName === 'update') {
              secondary = controllerName === 'remove' ? undefined: secondary;
              console.log('query', query, secondary);
              socketEmit(query, secondary, route, controllerName, functionIndex, true);

            } else if (controllerName === 'create') {
              socketEmit(options.body, null, route, controllerName, null);
            }

            function socketEmit(query, secondary, route, name, index, clearCache) {
              
              if (index) {
                if(secondary) {
                  var options = clearCache ? {user,type:index,query,secondary,clearCache} : {user,type:index,query,secondary};
                  modelFunction[name][index](options, async (err, data) => {
                  var sendData = err ? err : data;
                  sendData = await message.sockets(sendData);
                  socket.emit(route, sendData);
                });
              } else {
                var options = clearCache ? {user,type:index,query,secondary,clearCache} : {user,type:index,query,secondary};
                modelFunction[name][index](options, (err, data) => {
              
                  socket.emit(route, data);
                });
              }
              } else {
                var options = clearCache ? {user,type:index,query,secondary,clearCache} : {user,type:index,query,secondary};
                modelFunction[name](options, (err, data) => {

                  socket.emit(route, data);
                });
              }
            }

          }).catch(err => {

            socket.emit(route, err);
            console.log('ERROR', err)
          });
        }

      }

    });

  }

}