"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageToken = exports.loginRegister = void 0;
const PassportSetup_1 = require("./PassportSetup");
const UserModel_1 = require("jassijs/UserModel");
const Serverservice_1 = require("jassijs/remote/Serverservice");
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var router = express.Router();
router.post('/register', async (req, res) => {
    var username = decodeURIComponent(req.rawBody.split("&")[0].split("=")[1]);
    var password = decodeURIComponent(req.rawBody.split("&")[1].split("=")[1]);
    try {
        var context = {
            isServer: true,
            request: req
        };
        await (await Serverservice_1.serverservices.db).createUser(context, username, password);
        console.log("user created");
        /*const user= new User();
        user.email=username;
        user.password=passwordHash;
        await (await DBManager.get()).save(user);*/
        res.redirect("/login.html"); //status(200).send({ username });
    }
    catch (error) {
        res.status(400).send({
            error: error.message,
        });
    }
});
router.post('/login', (req, res) => {
    var username = decodeURIComponent(req.rawBody.split("&")[0].split("=")[1]);
    var password = decodeURIComponent(req.rawBody.split("&")[1].split("=")[1]);
    req.body = {
        username,
        password
    };
    passport.authenticate('local', { session: false }, (error, user) => {
        if (error || !user) {
            res.status(400).json({ error });
        }
        /** This is what ends up in our JWT */
        const payload = {
            user: user.id,
            isAdmin: (user.isAdmin === null ? false : user.isAdmin),
            expires: Date.now() + PassportSetup_1.JWT_EXPIRATION_MS // parseInt(process.env.JWT_EXPIRATION_MS),
        };
        /** assigns payload to req.user */
        req.login(payload, { session: false }, (error) => {
            if (error) {
                res.status(400).send({ error });
            }
            /** generate a signed json web token and return it in the response */
            const token = jwt.sign(JSON.stringify(payload), UserModel_1.UserModel.secret);
            /** assign our jwt to the cookie */
            res.cookie('jwt', token, { httpOnly: true /*, secure: true */ });
            console.log("enable secure login");
            res.status(200).send({ username: user.username });
        });
    })(req, res);
});
var loginRegister = router;
exports.loginRegister = loginRegister;
function manageToken(req, res, next) {
    jwt.verify(req.cookies["jwt"], UserModel_1.UserModel.secret, function (err, decodedToken) {
        if (err) {
            //      console.log("expired")
        }
        else {
            var test = PassportSetup_1.JWT_EXPIRATION_MS * 0.75;
            if (decodedToken.expires < new Date().getTime()) {
                //expired
            }
            else if ((decodedToken.expires - test) < new Date().getTime()) { //refreh
                console.log("refresh Token");
                decodedToken.expires = Date.now() + PassportSetup_1.JWT_EXPIRATION_MS;
                const newToken = jwt.sign(JSON.stringify(decodedToken), UserModel_1.UserModel.secret);
                res.cookie("jwt", newToken, { httpOnly: true /*,secure:true*/ });
                req.user = decodedToken.user;
                req.isAdmin == decodedToken.isAdmin;
            }
            else {
                req.user = decodedToken.user;
                req.isAdmin == decodedToken.isAdmin;
            }
        }
    });
    next();
}
exports.manageToken = manageToken;
//# sourceMappingURL=PassportLoginRegister.js.map