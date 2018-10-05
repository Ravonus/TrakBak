let policyConfig, promises,
watch = require('node-watch');

try {policyConfig = require(`./config/modelName/routeType.json`);}catch (e) {}
var promiseFunctions = require('./controllers/promiseBuilder');

//const refresh = require('./webServer/express').refresh;

const mongooseCrud = require('./webServer/mongooseCrud/mongooseCrud')


watch('./config/', { recursive: true }, function(evt, name) {
  console.log('%s changed.', name);

  delete require.cache[require.resolve('./config/modelName/routeType.json')]
  delete require.cache[require.resolve('./webServer/routes/routes')]
  let router = require('./webServer/routes/routes');
  policyConfig = require(`./config/modelName/routeType.json`);
  //let refresh = require('./webServer/express').refresh;
 // mongooseCrud();
  router.refresh()

});


var functionNames = {
  read : ['findById', 'find'],
  create : [''],
  update : ['byId', 'byFind'],
  remove : ['byId', 'byFind']
}

var routeType = (req, res) => {

  
  // delete require.cache[require.resolve('./config/modelName/routeType.json')]
  // policyConfig = require(`./config/modelName/routeType.json`);
  // let router = require('./webServer/routes/routes');

  // //let refresh = require('./webServer/express').refresh;
  // mongooseCrud();
  // router.refresh()
//  console.log(require('./webServer/express'))
//console.log(require('./app').appSecure)
 // refresh(require('./app').appSecure)


  
  //  // refreshApiRoutes();

   
  //   policyConfig = require(`./config/modelName/routeType.json`);
  //   console.log(policyConfig.policies, ' ddda fucc')

  // mongooseCrud('update');


  let authPromise = promiseFunctions.checkAuth(req, policyConfig.isAuthenticated);

  authPromise
    .then(data => {


      req.userObj = data;
      
      let mongoosePromise = promiseFunctions.mongoosePromise('modelName', 'routeType', functionNames.routeType, req);

      promises = promiseFunctions.grabPromises(policyConfig.policies, req);
    function promiseAll() {
      Promise.all(promises)
        .then(data => {

          return mongoosePromise()

        })
        .then(data => {

          return res.status(200).send(data);
        }).catch(err => {
         console.log('dizzz be error ', promises);
         console.log('dizzz be error ', err.index);
        //  promises[err.index+1] = undefined;
         apiError({ res: res, type: err.err, statusCode: 500 })

        })

      }
      promiseAll()
    }).catch(err => {

      apiError({ res: res, type: err, statusCode: 500 })

    })

}

module.exports = routeType;