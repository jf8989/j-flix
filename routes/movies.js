// /routes/movies.js
const express = require("express");
const moviesController = require("../controllers/moviesController");
const passport = require("passport");
require("../passport");

const router = express.Router();

// All routes are protected
/**
 * Route serving all movies.
 * @name GET /movies
 * @function
 * @memberof module:routes/movies
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/moviesController.getAllMovies}
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  moviesController.getAllMovies
);

/**
 * Route serving a single movie by title.
 * @name GET /movies/:title
 * @function
 * @memberof module:routes/movies
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/moviesController.getMovieByTitle}
 */
router.get(
  "/:title",
  passport.authenticate("jwt", { session: false }),
  moviesController.getMovieByTitle
);

/**
 * Route serving movies by genre name.
 * @name GET /movies/genre/:name
 * @function
 * @memberof module:routes/movies
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/moviesController.getMoviesByGenre}
 */
router.get(
  "/genre/:name",
  passport.authenticate("jwt", { session: false }),
  moviesController.getMoviesByGenre
);

/**
 * Route serving movies by actor name.
 * @name GET /movies/actor/:actorName
 * @function
 * @memberof module:routes/movies
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/moviesController.getMoviesByActor}
 */
router.get(
  "/actor/:actorName",
  passport.authenticate("jwt", { session: false }),
  moviesController.getMoviesByActor
);

/**
 * Route serving movies by release year.
 * @name GET /movies/year/:year
 * @function
 * @memberof module:routes/movies
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/moviesController.getMoviesByYear}
 */
router.get(
  "/year/:year",
  passport.authenticate("jwt", { session: false }),
  moviesController.getMoviesByYear
);

/**
 * Route serving movies by minimum rating.
 * @name GET /movies/rating/:minRating
 * @function
 * @memberof module:routes/movies
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/moviesController.getMoviesByRating}
 */
router.get(
  "/rating/:minRating",
  passport.authenticate("jwt", { session: false }),
  moviesController.getMoviesByRating
);

module.exports = router;
