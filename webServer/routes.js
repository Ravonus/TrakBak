var express = require('express');
var routes = require('./controllers/defaultRoutes');

var router = express.Router();
//User Routes
router.route('/user/create').post(routes.user.createUser);

//default Routes
router.route('/').get(routes.home);
router.route('/login').get(routes.login);
router.route('/callback').get(routes.callback);
router.route('/auth/verify').get(routes.verify);
router.route('/script/template').get(routes.template);
router.route('/script/template').get(routes.template);
router.route('*').get(routes.catchAll);

module.exports = router;