const isReachable = require('is-reachable'),
      fs = require('fs')
      ip = require('ip'),
      http = require('http'),
      config = require('./../config/config.js'),
      chai = require('chai');

   
describe('Check All Server Routes', function () {

  describe('Check Node Route and Ports', function () {

    describe(`Check http ${ip.address()} with port ${config.httpPort}`, function () {
      console.log(`${ip.address()}:${config.httpPort}`)
      it('Should return true', function () {

        return isReachable(`${ip.address()}:${config.httpPort}`).then(reachable => {

          chai.expect(reachable).to.be.true
           
        })
    
      });


    });

    describe(`Check http//${ip.address()}:${config.httpPort}/page/not/found`, function () {

      it('Should return 404', function (done) {

        var options = {method: 'GET', host: `${ip.address()}`, port: config.httpPort, path: '/page/not/found'};
        var req = http.request(options, function(res) {
          chai.expect(res.statusCode).to.equal(404);

            done();
          });
       req.end();
    
      });


    });

  });

});