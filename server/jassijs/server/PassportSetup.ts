
import { User } from "jassijs/remote/security/User";
import { DBManager } from "./DBManager";
import { UserModel } from "jassijs/UserModel";
import { Context } from "jassijs/remote/RemoteObject";

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const jwt = require('jsonwebtoken');


const JWT_EXPIRATION_MS=60000*30;//30min
export {JWT_EXPIRATION_MS};

passport.use(new LocalStrategy({
  usernameField: "username",
  passwordField: "password",
}, async (username, password, done) => {
  try {
    var context:Context={
      isServer:true
  }
    const userDocument = await (await DBManager.get()).getUser(context,username,password); //UserModel.findOne({username: username});
    if (userDocument) {
      return done(null, userDocument);
    } else {
      return done('Incorrect Username / Password');
    }
  } catch (error) {
    done(error);
  }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: UserModel.secret,
  },
  (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done('jwt expired');
    }

    return done(null, jwtPayload);
  }
));

