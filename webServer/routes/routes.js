const express = require('express'),
  routes = require('./defaultRoutes'),
  bodyParser = require('body-parser').json(),
  config = require('../../config/config'),
  next = (string) => { },
  router = express.Router();
  
//let r = router.route(path).post(bodyParser, route);

//User Routes

console.log(User.api);

//User Create Route
//router.route('/user').post(bodyParser, routes.user.createUser, next);

//User Login Route

function cb() {
  if(global.trakbak.controllers) {
    
    controllerNames.forEach((controller) => {

      if(controller.type === 'update'){
        router.route(`/${controller.name}/:_id`)[controller.request](bodyParser, config.controllers[controller.name].api[controller.type]);
      }
      if(controller.type === 'remove'){
        console.log(controller)
        router.route(`/${controller.name}/:_id`)[controller.request](bodyParser, config.controllers[controller.name].api[controller.type]);
      }

      router.route(`/${controller.name}`)[controller.request](bodyParser, config.controllers[controller.name].api[controller.type]);
    })


  } else {
    console.log('asd')
    setTimeout(function () { cb(); }, 0);
  }
}
cb()





router.route('/user/login').post(bodyParser, routes.user.login);

//User Me route (Check jwt token);
router.route('/user/me').get(bodyParser, routes.user.me, next);


//default Routes

//Home Page
router.route('/').get(routes.home, next);

//Login Page
//router.route('/login').get(routes.login, next);

//Catch All route(This makes sure if you go to non-existing route. It has a 404 page.)
router.route('*').get(routes.catchAll);

module.exports = router;