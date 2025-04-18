// routes/series.js
const express = require("express");
const seriesController = require("../controllers/seriesController");
const passport = require("passport");
require("../passport");

const router = express.Router();

// All routes are protected with JWT authentication
/**
 * Route serving all series.
 * @name GET /series
 * @function
 * @memberof module:routes/series
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/seriesController.getAllSeries}
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  seriesController.getAllSeries
);

/**
 * Route serving a single series by title.
 * @name GET /series/title/:title
 * @function
 * @memberof module:routes/series
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/seriesController.getSeriesByTitle}
 */
router.get(
  "/title/:title",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByTitle
);

/**
 * Route serving series by genre name.
 * @name GET /series/genre/:name
 * @function
 * @memberof module:routes/series
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/seriesController.getSeriesByGenre}
 */
router.get(
  "/genre/:name",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByGenre
);

/**
 * Route serving series by status.
 * @name GET /series/status/:status
 * @function
 * @memberof module:routes/series
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/seriesController.getSeriesByStatus}
 */
router.get(
  "/status/:status",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByStatus
);

/**
 * Route serving series by actor name.
 * @name GET /series/actor/:actorName
 * @function
 * @memberof module:routes/series
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/seriesController.getSeriesByActor}
 */
router.get(
  "/actor/:actorName",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByActor
);

/**
 * Route serving series by minimum rating.
 * @name GET /series/rating/:minRating
 * @function
 * @memberof module:routes/series
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/seriesController.getSeriesByRating}
 */
router.get(
  "/rating/:minRating",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByRating
);

/**
 * Route serving series by first air year range.
 * @name GET /series/year-range/:startYear/:endYear
 * @function
 * @memberof module:routes/series
 * @param {string} path - Express path
 * @param {callback} middleware - Passport JWT authentication middleware.
 * @param {callback} middleware - {@link module:controllers/seriesController.getSeriesByYearRange}
 */
router.get(
  "/year-range/:startYear/:endYear",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByYearRange
);

module.exports = router;
