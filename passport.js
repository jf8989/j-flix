// passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const Users = require("./models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      Users.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            return callback(null, false, {
              message: "Incorrect username or password.",
            });
          }
          if (!user.validatePassword(password)) {
            return callback(null, false, { message: "Incorrect password." });
          }
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);

module.exports = passport;
