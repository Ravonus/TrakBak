const fs = require('fs'),
  chai = require('chai');


var assert = require('assert');
describe('Check Files', function () {

  describe('Check custom.js file', function () {

    describe('Check if custom.js is within template folder', function () {
      it('Should return true', function (done) {

        chai.expect(fs.existsSync('./templates/custom.js')).to.be.true;
        done();

      });
    });

    describe('Check if custom.js moved to public js file.', function () {
      it('Should return true', function (done) {

        chai.expect(fs.existsSync('./public/js/custom.js')).to.be.true;
        done();

      });
    });

    describe('Check if custom.js varibles were changed', function () {
      it('Should not return error', function (done) {

        var readFile = () => {

          try {

          } catch(e) {
            
          }

        fs.readFile('./public/js/custom.js', 'utf8', function (err, data) {

          if (err) {
            throw err;
          } 
          var regex = / = '{{(\w+}}';)/g;
          if(data.match(regex)) {
            throw new TypeError('Found varible within file custom.js');
          } else {


            done();
          }
//          throw new TypeError('Illegal salmon!');
           
          

          
        })
        
      }
        chai.expect(readFile).to.not.throw();


      });
    });
  });
});


