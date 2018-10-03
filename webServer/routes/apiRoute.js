
let policyConfig, promises,
watch = require('node-watch');

try {policyConfig = require(`./config/modelName/routeType.json`);}catch (e) {}
var promiseFunctions = require('./controllers/promiseBuilder');

//const refresh = require('./webServer/express').refresh;

const mongooseCrud = require('./webServer/mongooseCrud/mongooseCrud')


watch('./config/', { recursive: true }, function(evt, name) {
  delete require.cache[require.resolve('./config/modelName/routeType.json')]
  delete require.cache[require.resolve('./webServer/routes/routes')]
  let router = require('./webServer/routes/routes');

  try{
    policyConfig = require(`./config/modelName/routeType.json`);
  } 
  catch(err) {

  }
  
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
  var index = 0;
  authPromise
    .then(data => {
      req.userObj = data;
      
      let mongoosePromise = promiseFunctions.mongoosePromise('modelName', 'routeType', functionNames.routeType, req);

      promises = promiseFunctions.grabPromises(policyConfig.policies, req);


//       let allresults = function(arr) {
//         return Promise.all(arr.map(item => (typeof item.then == 'function' ? item.then : Promsie.resolve(item))(value => ({value, ok:true}), error => ({error, ok:false}))));
//     }

//     allresults(promises)
// .then(results => {
//     results.forEach(result => {
//         if(result.ok) {
//             return mongoosePromise()
//             return res.status(200).send(data);
//         } else {
//             // bad
//             apiError({ res: res, type: 'fucc', statusCode: 500 })
//         }
//     });
// })
     
    
function promiseAll(promises) {
      Promise.all(promises)
        .then((data) => {

          return mongoosePromise()

        })
        .then(data => {

     

          return res.status(200).send(data);
        }).catch((err) => {

          
      //    console.log(err.index)
       //   delete promises[index];
      
          console.log(promises)

      //    promiseAll(promises)


          apiError({ res: res, type: err.err, statusCode: 500 })

        })
      }
      promiseAll(promises)
    }).catch(err => {


      apiError({ res: res, type: err, statusCode: 500 })

    })

    

}

module.exports = routeType;