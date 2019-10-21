const fs = require('fs'),
  path = require('path')

const dir = __dirname,
  configDir = path.join(dir, '../../', 'config/modelConfigs');

Array.prototype.diff = function (a) {

  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};

let policy = new Promise(async (resolve, reject) => {

  let policies = {};
  let policySet = {};

  let removedFiles = ['policyLoad.js'];
  await Functions.asyncForEach(fs.readdirSync(dir).filter(item => !removedFiles.includes(item)), async (policy) => {
    let name = policy.slice(0, -3);
    policies[name] = {
      routes: {

      },
      function: `${dir}/${policy}`,
      enabled: false,
      linked: {
        groups: [],
        permissions: 0
      },
    };
  });

  await Functions.asyncForEach(fs.readdirSync(configDir), async (config) => {

    let contents = require(`${configDir}/${config}`);
    let policieDifferent;
    let runDiffernt = false;
    if (!contents.policies || Object.keys(contents.policies).length === 0) {
      contents.policies = policies;

      policySet[contents.path.toLowerCase()] = contents.policies;

      await fs.writeFileSync(`${configDir}/${config}`, JSON.stringify(contents, null, "\t"));

    } else {

      let contentPolicy = contents.policies;
      policieDifferent = Object.keys(policies).diff(Object.keys(contentPolicy));

      let policyKeys = Object.keys(contentPolicy);

      await Functions.asyncForEach(policyKeys, async (key) => {


        if (!Object.keys(policies).includes(key)) {

          delete contentPolicy[key];
          runDiffernt = true;
          //  delete contentPolicy[key];
        }
        if (contentPolicy[key] && !contentPolicy[key].enabled) delete contentPolicy[key]
      });

      policySet[contents.path.toLowerCase()] = JSON.parse(JSON.stringify(contentPolicy));

    }

    if (policieDifferent !== undefined && policieDifferent.length !== 0 || runDiffernt) {


      if (runDiffernt) policieDifferent = Object.keys(policies);

      let newPolicies = {};
      await Functions.asyncForEach(policieDifferent, async (key) => {
        newPolicies[key] = runDiffernt ? contents.policies[key] : policySet[key];
      });

      delete contents.policies;

      var newContents = contents

      newContents.policies = newPolicies;

      await fs.writeFileSync(`${configDir}/${config}`, JSON.stringify(newContents, null, "\t"))

    }

  });

  resolve(policySet);

});

module.exports = policy;