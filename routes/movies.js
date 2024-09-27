// /routes/movies.js
const express = require("express");
const moviesController = require("../controllers/moviesController");
const passport = require("passport");
require("../passport");

const router = express.Router();

// All routes are protected
router.get(
  "/",
  //passport.authenticate("jwt", { session: false }),
  moviesController.getAllMovies
);
router.get(
  "/:title",
  //passport.authenticate("jwt", { session: false }),
  moviesController.getMovieByTitle
);
router.get(
  "/genre/:name",
  //passport.authenticate("jwt", { session: false }),
  moviesController.getMoviesByGenre
);
router.get(
  "/actor/:actorName",
  //passport.authenticate("jwt", { session: false }),
  moviesController.getMoviesByActor
);
router.get(
  "/year/:year",
  //passport.authenticate("jwt", { session: false }),
  moviesController.getMoviesByYear
);
router.get(
  "/rating/:minRating",
  //passport.authenticate("jwt", { session: false }),
  moviesController.getMoviesByRating
);

module.exports = router;
