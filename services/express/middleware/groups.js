'use strict';

//const Groups = require('../../../models/mgSync/Groups');

module.exports = (groups) => {
    let groupObj = {}
    return async function (req, res, next) {

        if(!groups) return next();

        if(!req) return null;

        if (req.routeAccess) return next();

        let groupIds = await Groups.read({ name: groups }).catch(e => {});

        if (groupIds) {
            groupIds.forEach((group) => {
                groupObj[group.id] = true;
            });
        }

        let binaryArray = Functions.permissionArray(req.user.user[0].groups);
        let found = false;

        await Functions.asyncForEach(Object.keys(groupObj), (key) => {
            if (binaryArray[key]) found = true;
        });

        if (!found) return res.sendStatus(401);

        req.routeAccess = true;

        next();
    }
}
