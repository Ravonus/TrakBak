const mongoose = require('mongoose'),
      config = require('./../config/config'),
      startTime = require('../app').startTime,
      argv = require('yargs').argv,
      mongoDB = config.mongoDB;

let User = require('./models/User'),
prefix = config.envName,
connection,
databaseName = config.databaseName;
console.log('user/pw')
console.log(config.mongoUser);
console.log(config.mongopw);
let mongooseConnect, auth;
if(config.mongoUser){
mongooseConnect = `mongodb://${config.mongoUser}:${config.mongopw}@${mongoDB}:27017/${prefix}-${databaseName}`;
if(config.mongoAdmin) {
auth = {authdb:"admin"};
}
} else {
  mongooseConnect = `mongodb://${mongoDB}/${prefix}-${databaseName}`;
}

console.log(mongooseConnect);
mongoose.connect(mongooseConnect, {auth, useNewUrlParser: true } , (err) => {
 
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