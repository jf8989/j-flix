// auth.js
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET; // Load from .env
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport"); // Your local passport file

function generateJWTToken(user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you're encoding in the JWT
    expiresIn: "7d", // Token will expire in 7 days
    algorithm: "HS256", // This is the algorithm used to "sign" or encode the values of the JWT
  });
}

module.exports = (app) => {
  app.post("/login", (req, res) => {
    console.log("Login request received:", req.body);

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
