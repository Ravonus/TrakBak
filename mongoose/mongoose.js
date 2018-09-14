const mongoose = require('mongoose');


var schema = {};
var Author = require('./user');

mongoose.connect('mongodb://localhost/trakBak-dev', function (err) {
 
   if (err) throw err;
 
   console.log('Successfully connected');
 
});

module.exports = { 
  mongoose: mongoose, 
  Author: Author
};