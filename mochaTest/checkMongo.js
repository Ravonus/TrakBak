const fs = require('fs'),
      config = require('./../config/config.js'),
      mongoose = require('mongoose'),
      User = require('../webServer/models/User'),
      DB = require('../webServer/mongoose'),

      chai = require('chai');

      let createdUserId;

      mongoose.connection.dropDatabase(config.envName + '-' + config.databaseName);

describe('Mocha test for Mongo database checks', () =>  {

  describe('Check if Mongo server is up', () =>  {
    it('Should return 1, 0 means closed.', (done) =>  {

      const prefix = config.envName,
      databaseName = config.databaseName;
  
     chai.expect(mongoose.connection.readyState).to.eql(1);
    done();

    });

    
  });

  describe('Check to see if you can create user. With mongoose Schema.', () =>  {
    it('Should return mongo user schema/created user.', (done) =>  {

      let createUser = new DB.User({
        _id: new DB.mongoose.Types.ObjectId(),
        name: {
          firstName: 'mochaTestFn',
          lastName: 'mochaTestLast',
          username: 'mochaTestUn'
        },
        biography: 'mocha Test1231.',
        password: 'mochaPW'
      })

      createUser.save(function(err, user){
        if(err) {
          chai.expect(err).to.contain.keys('name', 'biography', 'passwordHash', 'created', 'updated', '__v', '_id');
          done();
        }
        createdUserId = user._id;
        chai.expect(user._doc).to.contain.keys('name', 'biography', 'passwordHash', 'created', 'updated', '__v', '_id');
        done();
      })

    });

  });

  describe('look up newly created user', () =>  {
    it('Should return mongo user schema/look up of user', (done) =>  {

      User.findOne({'_id': createdUserId}, function (err, user){
        if(err) {
          chai.expect('Could not find user: ' + createdUserId).to.be.false;
          done();
        }

        chai.expect(user._doc).to.contain.keys('name', 'biography', 'passwordHash', 'created', 'updated', '__v', '_id');
        done();
      });

    });

  });
});