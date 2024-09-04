// passport.js
require("dotenv").config();

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  passportJWT = require("passport-jwt");

// Import the specific models
const User = require("./models/User");

let JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // lowercase to match Postman request
      passwordField: "password", // lowercase to match Postman request
    },
    async (username, password, callback) => {
      try {
        console.log("Username received for login:", username);
        console.log("Password received for login:", password);

        // Use async/await with Mongoose
        const user = await User.findOne({ Username: username });

        if (!user) {
          console.log("Incorrect username");
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }

        // Check if password matches the stored hashed password
        if (!user.validatePassword(password)) {
          console.log("Incorrect password");
          return callback(null, false, { message: "Incorrect password." });
        }

        console.log("Login successful for user:", user.Username);
        return callback(null, user);
      } catch (error) {
        console.log("Error during login:", error);
        return callback(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "your_jwt_secret", // Load secret from .env
    },
    (jwtPayload, callback) => {
      return User.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
