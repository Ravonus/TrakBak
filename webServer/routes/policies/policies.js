let policies = {}

require("fs").readdirSync(__dirname).forEach(function(file) {
  if(file !== 'policies.js')
  console.log(file);
  policies[file.slice(0, -3)] = require("./" + file);
});

module.exports = policies;