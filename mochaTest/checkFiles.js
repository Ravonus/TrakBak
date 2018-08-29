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
  });
});