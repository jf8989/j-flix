// /routes/directos.js
const express = require("express");
const directorsController = require("../controllers/directorsController");
const passport = require("passport");
require("../passport");

const router = express.Router();

// All routes are protected except for user registration
/**
 * Route serving director details by name.
 * @name GET /directors/:name
 * @function
 * @memberof module:routes/directors
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/directorsController.getDirectorByName}
 */
router.get(
  "/:name",
  passport.authenticate("jwt", { session: false }),
  directorsController.getDirectorByName
);

/**
 * Route for updating a director's biography.
 * @name PUT /directors/:name/bio
 * @function
 * @memberof module:routes/directors
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/directorsController.updateDirectorBio}
 */
router.put(
  "/:name/bio",
  passport.authenticate("jwt", { session: false }),
  directorsController.updateDirectorBio
);

/**
 * Route serving all movies by a specific director.
 * @name GET /directors/:directorName/movies
 * @function
 * @memberof module:routes/directors
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/directorsController.getMoviesByDirector}
 */
router.get(
  "/:directorName/movies",
  passport.authenticate("jwt", { session: false }),
  directorsController.getMoviesByDirector
);

module.exports = router;
