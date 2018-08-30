'use strict';
 
var Greenlock = require('greenlock');
var greenlock;
 



 
// Storage Backend
var leStore = require('le-store-certbot').create({
  configDir: './tmp'                                 // or /etc/letsencrypt or wherever
, debug: true
});
 
 
// ACME Challenge Handlers
var leHttpChallenge = require('le-challenge-manual').create({
  webrootPath: './public/.well-known/acme-challenge'                              // or template string such as
, debug: true                                           // '/srv/www/:hostname/.well-known/acme-challenge'
});
 
 
function leAgree(opts, agreeCb) {
  // opts = { email, domains, tosUrl }
  agreeCb(null, opts.tosUrl);
}
 
greenlock = Greenlock.create({
  version: 'draft-12'                                     // 'draft-12' or 'v01'
                                                          // 'draft-12' is for Let's Encrypt v2 otherwise known as ACME draft 12
                                                          // 'v02' is an alias for 'draft-12'
                                                          // 'v01' is for the pre-spec Let's Encrypt v1
  //
  // staging API
  //server: 'https://acme-staging-v02.api.letsencrypt.org/directory'
 
  //
  // production API
,  server: 'https://acme-v02.api.letsencrypt.org/directory'
 
, store: leStore                                          // handles saving of config, accounts, and certificates
, challenges: {
    'http-01': leHttpChallenge                            // handles /.well-known/acme-challege keys and tokens
  }
, challengeType: 'http-01'                                // default to this challenge type
, agreeToTerms: leAgree                                   // hook to allow user to view and accept LE TOS
//, sni: require('le-sni-auto').create({})                // handles sni callback
 
                                                          // renewals happen at a random time within this window
, renewWithin: 14 * 24 * 60 * 60 * 1000                   // certificate renewal may begin at this time
, renewBy:     10 * 24 * 60 * 60 * 1000                   // certificate renewal should happen by this time
 
, debug: true
//, log: function (debug) {console.log.apply(console, args);} // handles debug outputs
});
 
 
// If using express you should use the middleware
// app.use('/', greenlock.middleware());
//
// Otherwise you should see the test file for usage of this:
// greenlock.challenges['http-01'].get(opts.domain, key, val, done)
 
 
 
// Check in-memory cache of certificates for the named domain
greenlock.check({ domains: [ 'example.com' ] }).then(function (results) {
  if (results) {
    // we already have certificates
    return;
  }
 
 
  // Register Certificate manually
  greenlock.register({
 
    domains: ['www.trakbak.tk']                                // CHANGE TO YOUR DOMAIN (list for SANS)
  , email: 'chad@technomancyit.com'                                 // CHANGE TO YOUR EMAIL
  , agreeTos: true                                            // set to tosUrl string (or true) to pre-approve (and skip agreeToTerms)
  , rsaKeySize: 2048                                        // 2048 or higher
  , challengeType: 'http-01'                                // http-01, tls-sni-01, or dns-01
 
  }).then(function (results) {
 
    console.log('success');
 
  }, function (err) {
 
    // Note: you must either use greenlock.middleware() with express,
    // manually use greenlock.challenges['http-01'].get(opts, domain, key, val, done)
    // or have a webserver running and responding
    // to /.well-known/acme-challenge at `webrootPath`
    console.error('[Error]: node-greenlock/examples/standalone');
    console.error(err.stack);
 
  });
 
});