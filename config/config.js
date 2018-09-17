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
  "mongoUser" : "travis",
  "mongopw" : "1234"
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
  'serverName': 'trakbak.com',
  'databaseName': 'trakbak',
  'mongoDB': 'localhost',
  'hashingSecret': 'thisIsAProductionSecret',
  'threads': 'auto',
  "ignoreSSL": false,
  "jwtSecret": 'thisIsSecretProduction'
};

// Shared variables - These will write to any environment (Keep in mind these will over right in common variable.)
environments.share = {
  version: '0.0.2 Alpha'
}

// Determine which enivorment was passed as a command-line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the enviorments obove, if not, default to staging
let environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

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

//Combine share environment variables with current envioronment.

environmentToExport = Object.assign(environmentToExport, environments.share)

if (!environmentToExport.jwtExpire) {
  environmentToExport.jwtExpire = 86400
}

// Export the module
module.exports = environmentToExport;