const path = require('path'),
  argv = require('yargs').argv;
/*
* Create and export configuration variables (This gets its information within the environment files. If new environment is required. Just create a config for it.)
*
*/

//Container for all the environments
let environments = {};

//run sass configuration on start

require('./sass.js');

require("fs").readdirSync(__dirname + '/environments/').forEach(function (file) {

  environments[file.slice(0, -5)] = require(__dirname + "/environments/" + file);
});

if (argv.environment || argv.env) {
  process.env.NODE_ENV = argv.environment || argv.env;
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
console.log(typeof (environmentToExport.certLocation));
if (typeof (environmentToExport.certLocation) === 'string') {

  process.env.NODE_EXTRA_CA_CERTS = path.join(__dirname, '../', environmentToExport.certLocation);


  console.log(process.env.NODE_EXTRA_CA_CERTS);
}

//Combine share environment variables with current envioronment.

if (!environmentToExport.jwtExpire) {

  environmentToExport.jwtExpire = 86400
}

if (environmentToExport.serverName) {
  process.env.cbSocket = environmentToExport.serverName;
  process.env.cbSocketBack = environmentToExport.serverName;
}

console.log(process.env.NODE_ENV)

// Export the module
module.exports = environmentToExport;