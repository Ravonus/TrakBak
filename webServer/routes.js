const express = require('express'),
  routes = require('./controllers/defaultRoutes'),
  bodyParser = require('body-parser').json(),
  config = require('../config/config'),
  next = (string) => { },
  router = express.Router();
  
//let r = router.route(path).post(bodyParser, route);

//User Routes

//User Create Route
router.route('/user').post(bodyParser, routes.user.createUser, next);

//User Login Route






router.route('/user/login').post(bodyParser, routes.user.login);

//User Me route (Check jwt token);
router.route('/user/me').get(bodyParser, routes.user.me, next);


//default Routes

//Home Page
router.route('/').get(routes.home, next);

//Login Page
router.route('/login').get(routes.login);
router.route('/auth/verify').get(routes.verify);
router.route('/script/template').get(routes.template);
router.route('/script/template').get(routes.template);

//Catch All route(This makes sure if you go to non-existing route. It has a 404 page.)
router.route('*').get(routes.catchAll);

module.exports = router;