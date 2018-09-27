const mongoose = require('mongoose'),
      config = require('./../config/config'),
      startTime = require('../app').startTime,
      argv = require('yargs').argv,
      mongoDB = config.mongoDB;

let modelUser = require('./models/User'),
prefix = config.envName,
connection,
databaseName = config.databaseName;

let mongooseConnect, auth;
if(config.mongoUser){
mongooseConnect = `mongodb://${config.mongoUser}:${config.mongopw}@${mongoDB}:27017/${prefix}-${databaseName}`;
console.log(mongooseConnect);
if(config.mongoAdmin) {
auth = {authdb:"admin"};

}
} else {
  mongooseConnect = `mongodb://${mongoDB}/${prefix}-${databaseName}`;
}

mongoose.connect(mongooseConnect, {auth, useNewUrlParser: true } , (err) => {
 
   if (err) {
     connection = 'No';
     console.log(err);
     console.log('Could not connect to mongodb')
     if (!argv.mochaTest && !argv.mocha && !argv.test && !argv.mochatest) {
     process.exit(err);
     }
   };
 
   connection = 'Yes';
   
   User.read.find({'name.firstName': 'erg'}, (user) => {
    if (user.error) console.log(user.error)
    console.log(user);
    console.log('Script Start Took: ', Date.now() - startTime + ' ms');
  });


      //If test was set as argument. Run mocha. (Server won't stay open after test).
      if (argv.mochaTest || argv.mocha || argv.test || argv.mochatest) {
        var Mocha = require('mocha'),
          fs = require('fs'),
          path = require('path');

        // Instantiate a Mocha instance.
        var mocha = new Mocha();

        var testDir = 'mochaTest'

        // Add each .js file to the mocha instance
        fs.readdirSync(testDir).filter((file) => {
          // Only keep the .js files
          return file.substr(-3) === '.js';

        }).forEach((file) => {
          mocha.addFile(
            path.join(testDir, file)
          );
        });

        // Run the tests.
        mocha.run((failures) => {

          process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures

          if (process.exitCode === -1) process.exit(failures);

          //exit node ( Our script stays open because it has a web server. Need to exit so mocha test finishes.)

          console.log('Mocha test '.yellow.bold + 'finished with no errors'.green.bold + '!\n\r'.blue.bold);

          process.exit('success')
        });

      };
 
});

mongoose.set('useCreateIndex', true);

module.exports = { 
  mongoose,
  connection, 
  modelUser
};