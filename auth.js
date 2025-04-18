// auth.js
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET; // Load from .env
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport"); // Your local passport file

/**
 * Generates a JWT token for a given user object.
 * @function generateJWTToken
 * @param {object} user - The user object to encode in the token (should include Username).
 * @returns {string} The generated JWT token.
 */
function generateJWTToken(user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you're encoding in the JWT
    expiresIn: "7d", // Token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to "sign" or encode the values of the JWT
  });
}

/**
 * Sets up the login endpoint using Passport local strategy.
 * @module auth
 * @param {object} app - The Express application instance.
 */
module.exports = (app) => {
  /**
 * Handles user login requests. Authenticates using Passport's 'local' strategy.
 * On successful authentication, generates a JWT token and sends user data and token in response.
 * @name POST /login
 * @function
 * @memberof module:auth
 * @param {string} path - Express path.
 * @param {callback} middleware - Passport authentication middleware.
 */
  app.post("/login", (req, res) => {
    console.log("Login request received");
    console.log("Login request received:", req.body);
    console.log("Login request headers:", req.headers);

    passport.authenticate("local", { session: false }, (error, user, info) => {
      console.log("Passport authenticate callback reached");
      if (error) {
        console.log("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        console.log("Login failed:", info);
        return res
          .status(400)
          .json({ message: info.message || "Invalid credentials" });
      }

      console.log("User authenticated successfully:", user.Username);

      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          console.log("Login callback error:", loginError);
          return res.status(500).json({ message: "Login process failed" });
        }

        const token = generateJWTToken(user.toJSON());
        console.log("Login successful, JWT token generated");
        return res.json({ user, token });
      });
    })(req, res);
  });
};
