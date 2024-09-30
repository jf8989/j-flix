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
      usernameField: "username", // Field names in the request body
      passwordField: "password",
    },
    async (username, password, callback) => {
      try {
        // Convert username to lowercase
        const lowerUsername = username.toLowerCase();
        console.log("Username received for login:", username);
        console.log("Password received for login:", password);
        console.log("Username converted to lowercase:", lowerUsername);

        // Find user with lowercase username
        const user = await User.findOne({ Username: lowerUsername });

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
    async (jwtPayload, callback) => {
      try {
        // Find the user specified in token
        const user = await User.findById(jwtPayload._id);
        if (user) {
          return callback(null, user);
        } else {
          return callback(null, false);
        }
      } catch (error) {
        return callback(error, false);
      }
    }
  )
);
