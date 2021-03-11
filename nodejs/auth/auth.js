const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/userModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const fetch = require("node-fetch");
var tools = require('../tools/tools');
var config = require('../config.json');

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};

var headerExtractor = function (req) {
    var token = null;
    if (req.headers['Authorization']) {
        token = req.headers['Authorization'].split(' ')[1];
    }
    return token;
};

passport.use(
    new JWTstrategy({
            secretOrKey: 'RgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x!A%D*',
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, headerExtractor])
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'register',
    new localStrategy({
            usernameField: 'username',
            passwordField: 'password',
            roleField: 'role',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        async (req, username, password, done) => {
            //console.log(req);
            try {
                const user = await createNewUser(req.body.username, req.body.password, req.body.role, req.body.name, req.body.surname, req.body.email);
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        async (req, username, password, done) => {
            try {
                const user = await UserModel.findOne({
                    username
                });

                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }

                return done(null, user, {
                    message: 'Logged in Successfully'
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);

async function createNewUser(username, password, role, name, surname, email) {
    let userData = {
        "username": username,
        "password": password,
        "role": role,
        "name": name,
        "surname": surname,
        "email": email,
    }

    let userDataResponse = await (await (await tools.doApiRequest("users", "POST", userData, true)).json()).data

    return userDataResponse;
}