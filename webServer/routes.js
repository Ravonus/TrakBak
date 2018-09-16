const express = require('express'),
  routes = require('./controllers/defaultRoutes'),
  bodyParser = require('body-parser').json(),
  router = express.Router();
  //let r = router.route(path).post(bodyParser, route);

//User Routes
router.route('/user').post(bodyParser, routes.user.createUser);


//default Routes
router.route('/').get(routes.home);
router.route('/login').get(routes.login);
router.route('/auth/verify').get(routes.verify);
router.route('/script/template').get(routes.template);
router.route('/script/template').get(routes.template);
router.route('*').get(routes.catchAll);

module.exports = router;