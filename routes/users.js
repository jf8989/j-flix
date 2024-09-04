// routes/users.js
const express = require("express");
const usersController = require("../controllers/usersController");
const passport = require("passport");
require("../passport");

const router = express.Router();

// Route to register a new user (no authentication required)
router.post("/", usersController.registerUser);

// All other routes are protected
router.put(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  usersController.updateUserInfo
);
router.post(
  "/:username/movies/:movieId",
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
