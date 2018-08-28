var express = require('express');
var defaultCtrl = require('./controllers/defaultRoutes');

var router = express.Router();

router.route('/').get(defaultCtrl.home);
router.route('/login').get(defaultCtrl.login);
router.route('/callback').get(defaultCtrl.callback);
router.route('/auth/verify').get(defaultCtrl.verify);
router.route('/script/template').get(defaultCtrl.template);
router.route('*').get(defaultCtrl.catchAll);

module.exports = router;