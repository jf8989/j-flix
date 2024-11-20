const express = require("express");
const seriesController = require("../controllers/seriesController");
const passport = require("passport");
require("../passport");

const router = express.Router();

// All routes are protected with JWT authentication
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  seriesController.getAllSeries
);

router.get(
  "/title/:title",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByTitle
);

router.get(
  "/genre/:name",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByGenre
);

router.get(
  "/status/:status",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByStatus
);

router.get(
  "/actor/:actorName",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByActor
);

router.get(
  "/rating/:minRating",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByRating
);

router.get(
  "/year-range/:startYear/:endYear",
  passport.authenticate("jwt", { session: false }),
  seriesController.getSeriesByYearRange
);

module.exports = router;
