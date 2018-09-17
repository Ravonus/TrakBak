const fs = require('fs'),
      config = require('./../config/config.js'),
      mongoose = require('mongoose'),
      chai = require('chai');


describe('Check Mongo Database', () =>  {
  describe('Check if Mongo server is up', () =>  {
    it('Should return 1', (done) =>  {


      const prefix = config.envName,
      databaseName = config.databaseName;
   

    

     chai.expect(mongoose.connection.readyState).to.eql(1);
    done();

    });

    
  });
});