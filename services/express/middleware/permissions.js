'use strict';

let mongoose = require('mongoose');

module.exports = (permissions) => {

    return async function (req, res, next) {

        if (permissions === 0) return next();

        if (!req) return null;

        if (req.routeAccess) return next();
        let compareArray = Functions.permissionArray(permissions);
        let user = JSON.parse(req.user);
        req.user = user;
        let binaryArray = Functions.permissionArray(user.permissions);
        let allPerms = {};

        await Functions.asyncForEach(user.groups, async (group) => {

            if (typeof group === 'string') {
                group = await mongoose.models.Groups.m_read({
                    type: 'findById',
                    query: {
                        _id: group
                    }
                });

            }

            allPerms = Object.assign(binaryArray, Functions.permissionArray(group.permissions));
            binaryArray = allPerms;
        });


        let found = false;

        await Functions.asyncForEach(Object.keys(compareArray), (key) => {
            if (binaryArray[key]) found = true;
        });


        if (req.path === '/watch/_all') {

            console.log("AL:L TEST HERE")
            console.log(binaryArray)
            console.log(compareArray)
            console.log(found)
        }

        if (!found) return res.sendStatus(401);

        req.perms = binaryArray;
        req.routeAccess = true;

        next();
    }
}
