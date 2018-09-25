const path = require('path');


/*
* Create and export configuration variables
*
*/

//Container for all the environments
let environments = {};

// Staging (default environment)
environments.staging = {
  'httpPort': 3002,
  'httpsPort': 3003,
  'envName': 'staging',
  'databaseName': 'trakbak',
  'mongoDB': 'localhost',
  'hashingSecret': 'thisIsASecret',
  'threads': 8,
  "ignoreSSL": true,
  "jwtSecret": 'thisIsSecretStaging',
  "mongoAdmin" : true
};

// Staging (default environment)
environments.development = {
  'httpPort': 3002,
  'httpsPort': 3003,
  'envName': 'development',
  'databaseName': 'trakbak',
  'mongoDB': 'localhost',
  'hashingSecret': 'thisIsASecret',
  'threads': 'softwareOff',
  "ignoreSSL": true,
  "jwtSecret": 'thisIsSecretDevelopment',


};

//Production environment
environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production',
  'serverName': 'https://www.trakbak.tk:5001',
  'databaseName': 'trakbak',
  'mongoDB': 'localhost',
  'hashingSecret': 'thisIsAProductionSecret',
  'threads': 'auto',
  "ignoreSSL": false,
  "jwtSecret": 'thisIsSecretProduction'
};

// Shared variables - These will write to any environment (Keep in mind these will over right in common variable.)
environments.share = {
  version: '0.0.2 Alpha',
  cookieSecret: 'theyBeS3crets!',
  host: 'localhost',
  certLocation: '/webServer/https/cert.pem',
  keyLocation: '/webServer/https/key.pem'
}

// Determine which enivorment was passed as a command-line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the enviorments obove, if not, default to staging
let environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

environmentToExport = Object.assign(environmentToExport, environments.share);

// This checks if environment has thread default changed. Default of node = 4. Auto will use math and count your threads(Hyper threading too), you can run softwareOff and it will remove hyper threading or software cores.

if (environmentToExport.threads === 'auto') {
  process.env.UV_THREADPOOL_SIZE = Math.ceil(Math.max(4, require('os').cpus().length * 1));
} else if (typeof (environmentToExport.threads) === 'number') {
  process.env.UV_THREADPOOL_SIZE = environmentToExport.threads;
} else if (environmentToExport.threads === 'softwareOff') {
  process.env.UV_THREADPOOL_SIZE = Math.ceil(Math.max(4, require('os').cpus().length * 1) / 2);

}

//Check ignore SSL and set correct process envioronment.

if (environmentToExport.ignoreSSL) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
console.log(typeof(environmentToExport.certLocation));
if(typeof(environmentToExport.certLocation) === 'string') {
  
  process.env.NODE_EXTRA_CA_CERTS =  path.join(__dirname, '../',  environmentToExport.certLocation);

 
  console.log(process.env.NODE_EXTRA_CA_CERTS);
}

//Combine share environment variables with current envioronment.



if (!environmentToExport.jwtExpire) {

  environmentToExport.jwtExpire = 86400
}

if(environmentToExport.serverName) {
  process.env.cbSocket = environmentToExport.serverName;
  process.env.cbSocketBack = environmentToExport.serverName;
}

environmentToExport.functions = require("../controllers/appFunctions");
environmentToExport.message = require("../controllers/messenger");


// Export the module
module.exports = environmentToExport;