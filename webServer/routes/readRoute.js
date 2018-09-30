
let policyConfig, promises;
try {
  policyConfig = require(`./config/modelName/routeType.json`).policies;
}
catch (e) {
}
var promiseFunctions = require('./controllers/promiseBuilder');

var routeType = (req, res) => {
  isAuthenticated(req, (err, data) => {
    req.userObj = data;

    let mongoosePromise = promiseFunctions.mongoosePromise('modelName', 'routeType', ['findById', 'find'], req);
    promises = promiseFunctions.grabPromises(policyConfig, req);

    Promise.all(promises)
    .then(data => {

      return mongoosePromise()

    })
    .then(data => {
      return res.status(200).send(data);
    }).catch(err => {
      
    console.log('errbody', err)

    apiError({ res: res, type:err, statusCode: 500 })
    
  })

  })
 




}

module.exports = routeType;
