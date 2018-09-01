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
  'hashingSecret' : 'thisIsASecret'

};

//Production environment
environments.production = {
  'httpPort' :  5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'serverName' : 'trakbak.com',
  'hashingSecret' : 'thisIsAProductionSecret'
};

// Determine which enivorment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the enviorments obove, if not, default to staging
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;
if(environmentToExport.envName === 'staging') {

   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
   
} else {

}
// Export the module
module.exports = environmentToExport;