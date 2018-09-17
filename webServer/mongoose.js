const mongoose = require('mongoose'),
      config = require('./../config/config'),
      startTime = require('../app').startTime,
      argv = require('yargs').argv,
      mongoDB = config.mongoDB;

let User = require('./models/User'),
prefix = config.envName,
connection,
databaseName = config.databaseName;

mongoose.connect(`mongodb://${mongoDB}/${prefix}-${databaseName}`, { useNewUrlParser: true } , (err) => {
 
   if (err) {
     connection = 'No';
     console.log(err);
     console.log('Could not connect to mongodb')
     if (!argv.mochaTest && !argv.mocha && !argv.test && !argv.mochatest) {
     process.exit(err);
     }
   };
 
   connection = 'Yes'
   console.log('Script Start Took: ', Date.now() - startTime + ' ms');
 
});

mongoose.set('useCreateIndex', true);

module.exports = { 
  mongoose,
  connection, 
  User
};