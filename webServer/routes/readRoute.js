
let policyConfig;
try {
  policyConfig = require(`./config/modelName/routeType.json`).policies;
}
catch (e) {
}
var promiseFunctions = require('./controllers/promiseBuilder');

var routeType = (req, res) => {

  let mongoosePromise = promiseFunctions.mongoosePromise('modelName', 'routeType', ['findById', 'find'], req);

  var promises = promiseFunctions.grabPromises(policyConfig);

  Promise.all(promises)
    .then(data => {

      return mongoosePromise()

    })
    .then(data => {
      return res.status(200).send(data);
    }).catch(err => apiError({ res: res, type: 'fucc', statusCode: 500 }))

}

module.exports = routeType;
