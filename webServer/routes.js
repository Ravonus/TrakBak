const express = require('express'),
  routes = require('./controllers/defaultRoutes'),
  bodyParser = require('body-parser').json(),
  router = express.Router();
  //let r = router.route(path).post(bodyParser, route);

//User Routes

//User Create Route
router.route('/user').post(bodyParser, routes.user.createUser);

//User Login Route
router.route('/user/login').post(bodyParser, routes.user.login);


//default Routes

//Home Page
router.route('/').get(routes.home);

//Login Page
router.route('/login').get(routes.login);
router.route('/auth/verify').get(routes.verify);
router.route('/script/template').get(routes.template);
router.route('/script/template').get(routes.template);

//Catch All route(This makes sure if you go to non-existing route. It has a 404 page.)
router.route('*').get(routes.catchAll);

module.exports = router;