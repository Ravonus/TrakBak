'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/login', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    passport.authenticate('local-signin', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Username or Password incorrect.'
            });
        }
        req.login(user, { session: false }, async (err) => {
            if (err) {
                return res.send(err);
            } else {

            let token = await jwt.sign(JSON.stringify(user), config.express.jwt);
            console.log('user', user)
          // user = user.user;
            return res.json({token, user});
            }
        });
    })(req, res, next);
})

module.exports = router;