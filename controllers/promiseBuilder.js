
let policies = require('../webServer/routes/policies/policies');
let config = require('../config/config');



let policy = {
  grabPromises: (policyConfig, req) => {

   
    let promises = [];

    console.log(req.userObj)
    
    if (policyConfig) {


      policyConfig.forEach((policyName, index) => {
        
        promises.push(permissions(req.userObj.permissions).promise(req.userObj, policyName));

        let active = (typeof policyName[Object.keys(policyName)].active === "undefined" ? true : policyName[Object.keys(policyName)].active);

        if (active && !policyName[Object.keys(policyName)].match) {
        console.log('fuc dawg', policyName[Object.keys(policyName)].groups.length)
          promises.push(
            new Promise((response, rej) => {

              policies[Object.keys(policyName)](req, (err, data) => {
                
                if (err) rej({err, index});
                else response(data);
              });

            })
          )
        } else {

          if(req.userObj && req.userObj.groups) {
            var groups = policyName[Object.keys(policyName)].groups;
            req.userObj.groups.forEach( (group) => {
              console.log('grouo', group.name, 'wtf', groups)
              if(groups.includes(group.name)) {
                console.log('bat man');
                promises.push(
                  new Promise((response, rej) => {
      
                    policies[Object.keys(policyName)](req, (err, data) => {
                      
                      if (err) rej({err, index});
                      else response(data);
                    });
      
                  })
                )
              }
            })
          }
        }

      })

     

      return promises;

    }

  },
  mongoosePromise: (modelName, routeType, modelFunction, req) => {

    if (Object.keys(req.body).length === 0) {

      req.body = req.query;

    }

    var promise =

      () => {
        return new Promise((response, rej) => {


          if (req.url.split('/').length >= 3 && routeType !== 'create') {


            let url = req.url.split('/');

            if (routeType !== 'update') {



              config.controllers[modelName][routeType][modelFunction[0]](url[2], (err, data) => {
                if (err) {
                  //     console.log(err);
                  rej(err)
                };
                response(data);
              });

            } else {

              config.controllers[modelName][routeType][modelFunction[0]](url[2], req.body, (err, data) => {

                if (err) {
                  rej(err)
                };

                response(data);
              });

            }

          } else if (routeType === 'create') {


            config.controllers[modelName][routeType](req.body, {}, (err, data) => {

              if (err) rej(err)
              response(data)
            });
          }
          else if (routeType === 'update') {
            config.controllers[modelName][routeType][modelFunction[1]](req.query, req.body, (err, data) => {

              if (err) rej({err:err})
              response(data)
            });


          } else {

            config.controllers[modelName][routeType][modelFunction[1]](req.body, (err, data) => {

              if (err) rej({err:err})
              response(data)
            });
          }

        })
      }

    return promise;

  },
  checkAuth: (req, str) => {

    return new Promise((response, rej) => {

      if (str.active) {

        isAuthenticated(req, (err, data) => {

          if (err) rej(err)
          response(data)

        })
      } else {
        req.userObj = {
          _id: 'public',
          name: 'public',
          groups: [{name:'public'}]
        }

        response(req.userObj);
      }
    })
  }
}

module.exports = policy