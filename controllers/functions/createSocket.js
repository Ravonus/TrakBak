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

// Options = name,groups,server,model,extras
module.exports = (socket, route, object, user, functions, options) => {

  if (!socket._events || socket._events && !socket._events[route]) {

    socket.on(route, (data) => {

      var oldOptions;

      if (data && data.data) {

        if (typeof data.data === 'object') {

          options = Object.assign(options, data.data);
        } else {
          console.log('DATA OTHER');
          //   options.value = data.data;
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
          //   console.log('Diz be policy??', policy);
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

            // if(options.groups) {
            //   options.groups.forEach( (group) => {
            //     groups.push(group);
            //   })
            // }

            //console.log(obj.groups)

          }

          if (index === array.length - 1) {

            promisesRun()
          }
          // not going to work because empty arrays

        });
      } else {
        promisesRun()
      }

      function promisesRun() {

        if (promises.length > 0) {
          Promise.all(promises).then(data => {
            var keys = {};
            var query = {};
            var controller = route.split(/(?=[A-Z])/);
            var modelFunction = config.controllers[capFirst(controller[0])]
            var controllerName = controller[1].toLowerCase();
            //console.log(window[capFirst(controller[0])])

            var functionIndex = Object.keys(modelFunction[controllerName])[0];

            if (options && options.type) {
            //  console.log(options);
              functionIndex = options.type
              switch (functionIndex) {
                case 'find':

                  break;
                case 'findOne':

                  break;
                case 'findById':

                  query = options.value ? options.value : options.id ? options.id : options._id
                  if (keys) {

                  }


                  break;
                case 'byId':
                  query = options.value ? options.value : options.id ? options.id : options._id
                  if (keys) {

                  }
                  break;
                case 'byFind':

                  break;
                default:

              }

              if (!modelFunction[controllerName][functionIndex]) {
                functionIndex = Object.keys(modelFunction[controllerName])[0];
            //    console.log('diz index', functionIndex);
              }
            }

            if (controllerName === 'read') {
             /// console.log('one little ducky, two little ducky');
              modelFunction[controllerName][functionIndex](query, keys, (err, data) => {
                console.log('ranZZZZZZZ')
                socket.emit(route, data);
              })
            } else if (controllerName === 'remove') {

              modelFunction[controllerName][functionIndex](query, (err, data) => {
            
                socket.emit(route, data);
              });

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