const isReachable = require('is-reachable'),
      fs = require('fs')
      ip = require('ip'),
      http = require('http'),
      https = require('https'),
      config = require('./../config/config.js'),
      chai = require('chai');

describe('Check All Server Routes', function () {

  describe('Check Node Route and Ports', function () {

    describe('Check Unsecure Routes', function () {

      describe(`Check http ${ip.address()} with port ${config.httpPort}`, function () {

        it('Should return true', function () {

          return isReachable(`${ip.address()}:${config.httpPort}`).then(reachable => {

            chai.expect(reachable).to.be.true

          })

        });


      });


      describe(`Check http//${ip.address()}:${config.httpPort}/page/not/found. Catch all`, function () {

        it('Should return 404', function (done) {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpPort, path: '/page/not/found' };
          var req = http.request(options, function (res) {
            chai.expect(res.statusCode).to.equal(404);

            done();
          });
          req.end();

        });


      });

      describe(`Check http//${ip.address()}:${config.httpPort}/`, function () {

        it('Should return 404', function (done) {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpPort, path: '/' };
          var req = http.request(options, function (res) {
            chai.expect(res.statusCode).to.equal(200);

            done();
          });
          req.end();

        });


      });

    });

    describe('Check Secure Routes', function () {

      describe(`Check https secure ${ip.address()} with port ${config.httpsPort}`, function () {

        it('Should return true', function () {

          return isReachable(`https://${ip.address()}:${config.httpsPort}`).then(reachable => {

            chai.expect(reachable).to.be.true

          })

        });


      });

      describe(`Check https//${ip.address()}:${config.httpsPort}/page/not/found Catch all`, function () {

        it('Should return 404', function (done) {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpsPort, path: '/page/not/found' };
          var req = https.request(options, function (res) {

            chai.expect(res.statusCode).to.equal(404);



            done();
          });
          req.end();

        });


      });

      describe(`Check https//${ip.address()}:${config.httpsPort}/`, function () {

        it('Should return 200', function (done) {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpsPort, path: '/' };
          var req = https.request(options, function (res) {

            chai.expect(res.statusCode).to.equal(200);

            done();
          });
          req.end();

        });

      });

    });

  });

});