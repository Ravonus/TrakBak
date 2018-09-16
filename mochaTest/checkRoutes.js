const isReachable = require('is-reachable'),
      fs = require('fs')
      ip = require('ip'),
      http = require('http'),
      https = require('https'),
      config = require('./../config/config.js'),
      chai = require('chai');

describe('Check All Server Routes',  () => {

  describe('Check Node Route and Ports', () =>{

    describe('Check Unsecure Routes', () =>{

      describe(`Check http ${ip.address()} with port ${config.httpPort}`, () =>{

        it('Should return true', () =>{

          return isReachable(`${ip.address()}:${config.httpPort}`).then(reachable => {

            chai.expect(reachable).to.be.true

          })

        });

      });

      describe(`Check http//${ip.address()}:${config.httpPort}/page/not/found. Catch all`, () =>{

        it('Should return 404', (done) => {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpPort, path: '/page/not/found' };
          var req = http.request(options, (res) => {
            chai.expect(res.statusCode).to.equal(404);

            done();
          });
          req.end();

        });


      });

      describe(`Check http//${ip.address()}:${config.httpPort}/`, () =>{

        it('Should return 404', (done) => {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpPort, path: '/' };
          var req = http.request(options, (res) => {
            chai.expect(res.statusCode).to.equal(200);

            done();
          });
          req.end();

        });

      });

    });

    describe('Check Secure Routes', () =>{

      describe(`Check https secure ${ip.address()} with port ${config.httpsPort}`, () =>{

        it('Should return true', () =>{

          return isReachable(`https://${ip.address()}:${config.httpsPort}`).then(reachable => {

            chai.expect(reachable).to.be.true

          })

        });

      });

      describe(`Check https//${ip.address()}:${config.httpsPort}/page/not/found Catch all`, () =>{

        it('Should return 404', (done) => {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpsPort, path: '/page/not/found' };
          var req = https.request(options, (res) => {

            chai.expect(res.statusCode).to.equal(404);

            done();
          });
          req.end();

        });


      });

      describe(`Check https//${ip.address()}:${config.httpsPort} /`, () =>{

        it('Should return 200', (done) => {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpsPort, path: '/' };
          var req = https.request(options, (res) => {

            chai.expect(res.statusCode).to.equal(200);

            done();
          });
          req.end();

        });

      });

      describe(`Check https//${ip.address()}:${config.httpsPort} /login`, () =>{

        it('Should return 200',  (done) => {

          var options = { method: 'GET', host: `${ip.address()}`, port: config.httpsPort, path: '/login' };
          var req = https.request(options, (res) => {

            chai.expect(res.statusCode).to.equal(200);

            done();
          });
          req.end();

        });

      });

    });

  });

});