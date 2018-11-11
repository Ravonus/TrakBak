const config = require('../../config/config');


Array.prototype.remove = function() {
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

  if (!options) {
    options = {};
  }







  if (!socket._events || socket._events && !socket._events[route]) {

    socket.on(route, (data) => {

      if (data && data.data) {

        if (typeof data.data === 'object') {
          options = Object.assign(data.data, options);
        }
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

      
      if(object.permissions && object.permissions > 0 ) {

        promises.push(config.functions.permissions(user.permissions).promise(user, object, 'sockets'));
      }
      

      if (Object.keys(array).length > 0) {

        array.forEach((policy, index) => {

          var myPolicy = policy[Object.keys(policy)];

          if(!myPolicy.match || myPolicy.match.length === 0){
            myPolicy.match = [];
          }

          if(!myPolicy.groups || myPolicy.groups.length === 0){
            myPolicy.groups = [];
          }

          console.log(myPolicy.match.includes(JSON.stringify(myPolicy.groups)));
          if(myPolicy.match.length > 0) {
            myPolicy.match.forEach( (match,index) => {
              if(myPolicy.groups.length > 0 && myPolicy.groups.includes(match)) {

                myPolicy.groups.remove(match);
                console.log(myPolicy.groups, 'and match?', myPolicy.match)
                if(index === myPolicy.match.length - 1) {
                    myPolicy.groups = [...myPolicy.groups, ...myPolicy.match];
                }
              }
            })
          }

       //   console.log('Diz be policy??', policy);

          promises.push(config.functions.permissions(user.permissions).promise(user, policy, 'sockets'));


          var obj = policy[Object.keys(policy)];


          if (obj && obj.sockets || obj && obj.sockets === undefined) {


  if(!obj.groups) {
    obj.groups = [];
  }
  if(!options.groups) {
    options.groups = [];
  }


  var groups = [...options.groups, ...obj.groups]

  if(!obj.permissions) {
    obj.permissions = 0;
  }
  if(!options.permissions) {
    options.permissions = 0;
  }

  var permissions = options.permissions + obj.permissions;

  

  // if(options.groups) {
  //   options.groups.forEach( (group) => {
  //     groups.push(group);
  //   })
  // }

  //console.log(obj.groups)
            
            promises.push(new Promise((resolve, reject) => {
              functions[Object.keys(policy)]({ userObj: { [user]: '0' } }, (err, data) => {

                if (err) {
                  return reject(err)
                }
                resolve(data);

              })

            }));

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
            var controller = route.split(/(?=[A-Z])/);
            var modelFunction = config.controllers[capFirst(controller[0])]
            var controllerName = controller[1].toLowerCase();
            //console.log(window[capFirst(controller[0])])
        
            if (!options || !options.type) {

              var functionIndex = Object.keys(modelFunction[controllerName])[0];

              modelFunction[controllerName][functionIndex]((err, data) => {

                socket.emit(route, data);
              })
            } else if (options.value) {

              var functionIndex = modelFunction[controllerName][options.type];


              functionIndex(options.value, (err, data) => {

                socket.emit(route, data);

              });

            } else {

            }


          }).catch(err => {

            socket.emit(route, err);
            console.log('ERROR')
          });
        }

      }

    });

  }

}