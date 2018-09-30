
let policies = require('../webServer/routes/policies/policies');
let config = require('../config/config');


let policy = {
  grabPromises: (policyConfig, req) => {

    let promises = [];

    if (policyConfig) {

      policyConfig.forEach((policyName) => {

        let active = (typeof policyName[Object.keys(policyName)].active === "undefined" ? true : policyName[Object.keys(policyName)].active);

        if (active)
          promises.push(
            new Promise((response, rej) => {

              policies[Object.keys(policyName)](req, (err, data) => {

                if (err) rej(err);
                else response(data);
              });

            })
          )

      })

      return promises;

    }

  },
  mongoosePromise: (modelName, routeType, modelFunction, req) => {

    if (Object.keys(req.body).length === 0) {

      console.log(req.query);
      req.body = req.query;

    }

    var promise =

      () => {
        return new Promise((response, rej) => {


            //     console.log(req.userObj);

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

                console.log(`${modelName} ${routeType} ${routeType} ${modelFunction[1]} ${url[2]}`)
                  console.log(config.controllers[modelName][routeType])
                config.controllers[modelName][routeType][modelFunction[0]](url[2], req.body, (err, data) => {
                  
                  if (err) {
                         console.log(err);
                    rej(err)
                  };
       
                  response(data);
                });

              }

            } else if (routeType === 'create') {

              config.controllers[modelName][routeType](req.body, {}, (err, data) => {

                console.log(err);

                if (err) rej(err)
                response(data)
              });
            }
            else {

              config.controllers[modelName][routeType][modelFunction[1]](req.body, (err, data) => {

                if (err) rej(err)
                response(data)
              });

            }

        })
      }

    return promise;

  },
  checkAuth: (req, str) => {
    console.log(str);
    return new Promise((response, rej) => {

    if(str.active) {
     
      isAuthenticated(req, (err, data) => {
        if (err) rej(err)
        response(data)

      })
    } else {
      response('noAuth');
    }
  })
  }
}

module.exports = policy