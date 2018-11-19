
let policies = require('../webServer/routes/policies/policies');
let config = require('../config/config');

let policy = {
  grabPromises: (policyConfig, req) => {

    let promises = [];
    
    if (policyConfig) {

      policyConfig.forEach((policyName, index) => {

        promises.push(permissions(req.userObj.permissions).promise(req.userObj, policyName));

        let active = (typeof policyName[Object.keys(policyName)].api === "undefined" ? true : policyName[Object.keys(policyName)].api);

        if (active && !policyName[Object.keys(policyName)].match || !policyName[Object.keys(policyName)].group 
        
        || active && policyName[Object.keys(policyName)].match.length === 0 || policyName[Object.keys(policyName)].group && policyName[Object.keys(policyName)].group.length === 0) {

          promises.push(
            new Promise((response, rej) => {

              policies[Object.keys(policyName)](req, (err, data) => {
                
                if (err) rej({err, index});
                else response(data);
              });

            })
          )
        } else 
          
          if(req.userObj && req.userObj.groups) {
            
            var groups = policyName[Object.keys(policyName)].groups;
            req.userObj.groups.forEach( (group) => {
          
              if(groups.includes(group.name)) {

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

              config.controllers[modelName][routeType][modelFunction[0]]({query: url[2] } , (err, data) => {
                if (err) {
                  rej(err)
                };
                response(data);
              });

            } else {
              
              var query = { query: url[2], secondary: req.body}

              config.controllers[modelName][routeType][modelFunction[0]](query, (err, data) => {

                if (err) {
                  rej(err)
                };

                response(data);
              });

            }

          } else if (routeType === 'create') {

            config.controllers[modelName][routeType]({query: req.body, secondary: {} }, (err, data) => {

              if (err) rej(err)
              response(data)
            });
          }
          else if (routeType === 'update') {
            var query = {query: req.query, secondary: req.body}
            config.controllers[modelName][routeType][modelFunction[1]](query, (err, data) => {

              if (err) rej({err:err})
              response(data)
            });


          } else {

            config.controllers[modelName][routeType][modelFunction[1]]({query:req.body}, (err, data) => {

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

      if (str.api) {
    
        isAuthenticated(req, (err, data) => {

          if (err) return rej(err)

          return response(data)

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
  }, 
  socketPromise: (policies) => {
    let sockets = [];
    return new Promise((response, reject) =>{ 

    })
  }
}

module.exports = policy