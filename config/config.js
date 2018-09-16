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
  'mongoDB' : 'localhost',
  'hashingSecret' : 'thisIsASecret',
  'threads' : 8
};

// Staging (default environment)
environments.development = {
  'httpPort': 3002,
  'httpsPort': 3003,
  'envName': 'development',
  'databaseName': 'trakbak',
  'mongoDB' : 'localhost',
  'hashingSecret' : 'thisIsASecret',
  'threads' : 'auto'
};

//Production environment
environments.production = {
  'httpPort' :  5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'serverName' : 'trakbak.com',
  'databaseName': 'trakbak',
  'mongoDB' : 'localhost',
  'hashingSecret' : 'thisIsAProductionSecret',
  'threads' : 'auto'
};

// Shared variables - These will write to any environment (Keep in mind these will over right in common variable.)
environments.share = {
  version: '0.0.2 Alpha'
}

// Determine which enivorment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


// Check that the current environment is one of the enviorments obove, if not, default to staging
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;
if(environmentToExport.envName === 'development' || environmentToExport.envName === 'staging') {

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
   
}

if( environmentToExport.threads === 'auto') {
  process.env.UV_THREADPOOL_SIZE = Math.ceil(Math.max(4, require('os').cpus().length * 1));

} else if(typeof(environmentToExport.threads) === 'number') {
  process.env.UV_THREADPOOL_SIZE = environmentToExport.threads;
}

//Combine share environment variables with current envioronment. 

environmentToExport = Object.assign(environmentToExport , environments.share)

// Export the module
module.exports = environmentToExport;