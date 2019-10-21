'use strict';

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportJWT = require("passport-jwt"),
    JWTStrategy = passportJWT.Strategy,
    customStrategy = require('./customStrategy'),
    {
        Users
    } = require('../../../apiModels/Users'),
    //    Accounts = require('../../../models/Accounts')
    ExtractJWT = passportJWT.ExtractJwt;

passport.use('local-signin', new LocalStrategy({
        usernameField: 'account',
        passwordField: 'password'
    },
    async function (account, password, cb) {

        let user;
        let options = {
            query: {
                account
            },
            type: 'findOne',
            login: true,
            excludes: '-messages'
        };

        user = await Users.m_read(options).catch(e => {

            console.log(e);
        });

        if (user) {

            user.validPassword(password, (data) => {
                if (!data) {

                    return cb({
                        err: 'err'
                    })
                } else {

                    user.passwordHash = undefined;
                    return cb(null, user);
                }

            });
        } else {
            cb({
                err: 'err'
            })
        }

    }
));

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};

passport.use(new JWTStrategy({

        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.express.jwt
    },
    function (jwtPayload, cb) {
        return cb(null, JSON.stringify(jwtPayload));
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    }
));

passport.use(new customStrategy('jwt',

    function (jwtPayload, cb) {
        //need to get JWT info still.
        return cb(null, JSON.stringify(jwtPayload));

    }
));