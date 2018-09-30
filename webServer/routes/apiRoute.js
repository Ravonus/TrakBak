
let policyConfig, promises;
try {policyConfig = require(`./config/modelName/routeType.json`);}catch (e) {}
var promiseFunctions = require('./controllers/promiseBuilder');

var functionNames = {
  read : ['findById', 'find'],
  create : [''],
  update : ['byId', 'byFind'],
  remove : ['byId', 'byFind']
}

var routeType = (req, res) => {

  let authPromise = promiseFunctions.checkAuth(req, policyConfig.isAuthenticated);

  authPromise
    .then(data => {
      req.userObj = data;

      let mongoosePromise = promiseFunctions.mongoosePromise('modelName', 'routeType', functionNames.routeType, req);

      promises = promiseFunctions.grabPromises(policyConfig.policies, req);

      Promise.all(promises)
        .then(data => {

          return mongoosePromise()

        })
        .then(data => {
          return res.status(200).send(data);
        }).catch(err => {

          apiError({ res: res, type: err, statusCode: 500 })

        })
    }).catch(err => {

      apiError({ res: res, type: err, statusCode: 500 })

    })

}

module.exports = routeType;