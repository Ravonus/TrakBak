const mongoose = require('mongoose');


var schema = {};
var User = require('./user');

mongoose.connect('mongodb://localhost/trakBak-dev', function (err) {
 
   if (err) throw err;
 
   console.log('Successfully connected');
 
});

module.exports = { 
  mongoose: mongoose, 
  User: User
};