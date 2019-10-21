'use strict';

var request = require('request');

module.exports = (req, res) => {

  return new Promise((resolve, reject) => {

    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      return reject({ "responseCode": 1, "responseDesc": "Please select captcha" });
    }
    var secretKey = config.express.recaptchaSiteSecret;
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl, function (error, response, body) {
      body = JSON.parse(body);
      if (body.success !== undefined && !body.success) {
        return reject(JSON.stringify({ "responseCode": 1, "responseDesc": "Failed captcha verification" }));
      }
      return resolve(true);
    });
  });
}