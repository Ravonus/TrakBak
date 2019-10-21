'use strict';

let policyScripts;
async function asyncLoad() {
    policyScripts = await require('../../../controllers/policies/policyLoad');

}

asyncLoad()

module.exports = (route) => {

    return async function (req, res, next) {
        let user = req.user;
        let key = req.route.path.toLowerCase();
        if (!policyScripts[key]) return next();
        let promises = [];
        let policies = policyScripts[key];
     
        await Functions.asyncForEach(Object.keys(policies), async key => {
            let policy = policies[key];

            console.log(policy.routes + req.method);
           
            let permArray = policy.linked ? Functions.permissionArray(policy.linked.permissions) : undefined;
   
            if(!policy.run) policy.run = 'begin';
            if (policy.linked && policy.linked.permissions && !policy.routes && policy.run === 'begin'
             || policy.linked && policy.linked.permissions && Object.keys(policy.routes).length === 0 && policy.run === 'begin'
             || policy.linked && policy.linked.permissions && policy.routes[req.method.toLowerCase()] && policy.run === 'begin'
             || policy.linked && policy.linked.permissions && policy.routes[req.method] && policy.run === 'begin') {

                Object.keys(permArray).forEach(key => {
                    console.log(req.perms);
                    if (req.perms && typeof req.perms !== 'string' && req.perms[key])
                        promises.push(require(policy.function)(req, res));
                });

            } else if(!policy.routes && policy.run === 'begin'
                || Object.keys(policy.routes).length === 0 && policy.run === 'begin'
                || policy.routes[req.method.toLowerCase()] && policy.run === 'begin'
                || policy.routes[req.method] && policy.run === 'begin') 
            promises.push(require(policy.function)(req, res));

        });

        Promise.all(promises).then(() => {
            return next();
        }).catch((e) => {

            console.log(e);
            return res.send(e).status(404);
        });

    }
}