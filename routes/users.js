// routes/users.js
const express = require("express");
const usersController = require("../controllers/usersController");
const passport = require("passport");
const { check } = require("express-validator"); // Add validation
require("../passport");

const router = express.Router(); // Create the router object

// Route to register a new user (no authentication required)
router.post(
  "/",
  [
    check(
      "username",
      "Username is required and must be at least 5 characters long"
    ).isLength({ min: 5 }),
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email must be valid").isEmail(),
  ],
  usersController.registerUser
);

// All other routes are protected
router.put(
  "/:username",
  [
    passport.authenticate("jwt", { session: false }),
    check("username", "Username must be at least 5 characters long")
      .optional()
      .isLength({ min: 5 }),
    check("email", "Email must be valid").optional().isEmail(),
  ],
  usersController.updateUserInfo
);

router.post(
  "/:username/movies/:movieID",
  passport.authenticate("jwt", { session: false }),
  usersController.addMovieToFavorites
);

router.delete(
  "/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  usersController.removeMovieFromFavorites
);

router.delete(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  usersController.deleteUser
);

module.exports = router;
