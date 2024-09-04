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

module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
