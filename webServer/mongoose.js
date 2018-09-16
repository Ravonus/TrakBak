const mongoose = require('mongoose'),
      config = require('./../config/config'),
      mongoDB = config.mongoDB;

let schema = {},
User = require('./models/User'),
prefix = config.envName,
databaseName = config.databaseName;

mongoose.connect(`mongodb://${mongoDB}/${prefix}-${databaseName}`, function (err) {
 
   if (err) throw err;
 
   console.log('Successfully connected');
 
});

module.exports = { 
  mongoose: mongoose, 
  User: User
};