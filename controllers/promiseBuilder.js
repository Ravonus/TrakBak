
let policies = require('../webServer/routes/policies/policies');
let config = require('../config/config');

function runPolicy(policyConfig) {
  let promises = [];

  if (policyConfig) {

    policyConfig.forEach((policyName) => {

      let active = (typeof policyName[Object.keys(policyName)].active === "undefined" ? true : policyName[Object.keys(policyName)].active);

      if (active)
        promises.push(
          new Promise((response, rej) => {

            policies[Object.keys(policyName)]((err, data) => {

              if (err) rej(err);
              else response(data);
            });

          })
        )

    })

    return promises;

  }

}

var mongoosePromise = (modelName, routeType, modelFunction, req) => {
  var promise =

    () => {
      return new Promise((response, rej) => {

        if (Object.keys(req.body).length === 0) {
          req.body = req.query;
        }

        if (req.url.split('/').length >= 3) {

          let url = req.url.split('/');

          config.controllers[modelName][routeType][modelFunction[0]](url[2], (err, data) => {
            if (err) {
              //     console.log(err);
              rej(err)
            };
            response(data);
          });

        }
        else {

          config.controllers[modelName][routeType][modelFunction[1]](req.query, (err, data) => {

            if (err) rej(err)
            response(data)
          });

        }
      })
    }

  return promise;

}

module.exports = { grabPromises: runPolicy, mongoosePromise }