"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRATION_MS = void 0;
const DBManager_1 = require("./DBManager");
const UserModel_1 = require("jassi/UserModel");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const jwt = require('jsonwebtoken');
const JWT_EXPIRATION_MS = 60000 * 30; //30min
exports.JWT_EXPIRATION_MS = JWT_EXPIRATION_MS;
passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
}, async (username, password, done) => {
    try {
        const userDocument = await (await DBManager_1.DBManager.get()).getUser(username, password); //UserModel.findOne({username: username});
        if (userDocument) {
            return done(null, userDocument);
        }
        else {
            return done('Incorrect Username / Password');
        }
    }
    catch (error) {
        done(error);
    }
}));
passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: UserModel_1.UserModel.secret,
}, (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
        return done('jwt expired');
    }
    return done(null, jwtPayload);
}));
//# sourceMappingURL=PassportSetup.js.map