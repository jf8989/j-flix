// /routes/directos.js
const express = require("express");
const directorsController = require("../controllers/directorsController");
const passport = require("passport");
require("../passport");

const router = express.Router();

// All routes are protected except for user registration
router.get(
  "/:name",
  passport.authenticate("jwt", { session: false }),
  directorsController.getDirectorByName
);
router.put(
  "/:name/bio",
  passport.authenticate("jwt", { session: false }),
  directorsController.updateDirectorBio
);
router.get(
  "/:directorName/movies",
  passport.authenticate("jwt", { session: false }),
  directorsController.getMoviesByDirector
);

module.exports = router;
