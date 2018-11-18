const mongoose = require('mongoose'),
  config = require('./../config/config'),
  startTime = require('../app').startTime,
  argv = require('yargs').argv,
  autoIncrement = require('mongoose-auto-increment'),
  mongoDB = config.mongoDB;

  require('../webServer/services/redis');
  mongoose.Promise = global.Promise;


let modelUser = require('./models/User'),
  prefix = config.envName,
  connection,
  databaseName = config.databaseName;

  mongoose.set('useFindAndModify', false);

let mongooseConnect, auth;
if (config.mongoUser) {
  mongooseConnect = `mongodb://${config.mongoUser}:${config.mongopw}@${mongoDB}:27017/${prefix}-${databaseName}`;

  if (config.mongoAdmin) {
    auth = { authdb: "admin" };

  }
} else {
  mongooseConnect = `mongodb://${mongoDB}/${prefix}-${databaseName}`;
}

mongoose.connect(mongooseConnect, { auth, useNewUrlParser: true }, (err, data) => {

  if (err) {
    connection = 'No';
    console.log(err);
    console.log('Could not connect to mongodb')
    if (!argv.mochaTest && !argv.mocha && !argv.test && !argv.mochatest) {
      process.exit(err);
    }
  };

  connection = data;

  function done(data) {

  }

  permissions(254+ 256 + 512+ +1024+ 274877906945+2251799813685248).pf((err, data) => {


  });




  function cb() {



    
  if(global.trakbak.controller) {
  
    User.read.find(
      {'name.firstName':'ergMon', createdAt:{lte:Date.now()}},{passwordHash:false},
       (user) => {
         if (typeof (user) === 'undefined' || user && user.error) console.log(typeof (user) === 'undefined' ? 'Could not find user' : user.error)
       //  console.log(user);
         // console.log('Script Start Took: ', Date.now() - startTime + ' ms');
       });
   
   
     User.read.findOne({'name.firstName':'erg', createdAt:{lte:Date.now()}},{name:false, passwordHash:false},
     (user) => {
       if (typeof (user) === 'undefined' || user && user.error) console.log(typeof (user) === 'undefined' ? 'Could not find user' : user.error)
     //   console.log(user);
        console.log('Script Start Took: ', Date.now() - startTime + ' ms');
     });
   
     User.read.findById({_id:'5bad5ed4766ee30c58a94d6b', groups:{lt:1, gt:5}},{name:false, passwordHash:false},
     (user) => {
       if (typeof (user) === 'undefined' || user && user.error) console.log(typeof (user) === 'undefined' ? 'Could not find user' : user.error)
       // console.log(user);
       // console.log('Script Start Took: ', Date.now() - startTime + ' ms');
     });
   
       // User.create({
       //   "name.firstName":"ergMon",
       //   "name.lastName": "testLastzaTits",
       //   "password": "password",
       //   "name.username" : "mognoseAuto4"
       // },{password: false}, (data) => {
       //   console.log(data);
       // })
   

       // Groups.create({
       //   "name":"Group-Auto",
       //   "permission": 4
       // }, (data) => {
       //   console.log(data);
       // })
   
       // User.update.byId('5bad5ed4766ee30c58a94d6b', {biography:'updated foo'}, (data) => {
       //     console.log(data);
       // });
   
       User.update.byFind({'name.username': 'mognoseAuto3'}, {'name.lastName':'updated foo from find'}, (data) => {
    //     console.log(data);
     });
   
   //   User.delete.byId('5bad5ed4766ee30c58a94d6b', (data) => {
   //     console.log(data);
   // });
   
   // User.delete.byFind({'name.username': 'mognoseAuto4'}, (data) => {
   //   console.log(data);
   // });

  } else {
    setTimeout(function () { cb(); }, 0);
  }

}

//cb();





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
  User: modelUser
};