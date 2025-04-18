// controllers/seriesController.js
const Series = require("../models/Series");

// Get all series from the database
/**
 * Retrieves all series from the database.
 * @function getAllSeries
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of all series or 500 error.
 * @async
 */
async function getAllSeries(req, res) {
  try {
    const series = await Series.find();
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get a series by its title
/**
 * Retrieves a single series by its title.
 * Uses the title provided in `req.params.title`.
 * @function getSeriesByTitle
 * @param {object} req - Express request object, expects `req.params.title`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with the series data or 404/500 error.
 * @async
 */
async function getSeriesByTitle(req, res) {
  try {
    const series = await Series.findOne({ title: req.params.title });
    if (series) {
      res.json(series);
    } else {
      res.status(404).send("Series not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by genre
/**
 * Retrieves series belonging to a specific genre.
 * Uses the genre name provided in `req.params.name`.
 * @function getSeriesByGenre
 * @param {object} req - Express request object, expects `req.params.name`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of series or 500 error.
 * @async
 */
async function getSeriesByGenre(req, res) {
  try {
    const genreName = req.params.name;
    const series = await Series.find({
      "genres.name": genreName,
    });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by status
/**
 * Retrieves series based on their status (Ongoing, Ended, Cancelled).
 * Uses the status provided in `req.params.status`.
 * @function getSeriesByStatus
 * @param {object} req - Express request object, expects `req.params.status`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of series or 500 error.
 * @async
 */
async function getSeriesByStatus(req, res) {
  try {
    const series = await Series.find({ status: req.params.status });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by actor
/**
 * Retrieves series featuring a specific actor.
 * Uses the actor name provided in `req.params.actorName`.
 * @function getSeriesByActor
 * @param {object} req - Express request object, expects `req.params.actorName`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of series or 500 error.
 * @async
 */
async function getSeriesByActor(req, res) {
  try {
    const series = await Series.find({ actors: req.params.actorName });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by minimum rating
/**
 * Retrieves series with a rating greater than or equal to a minimum value.
 * Uses the minimum rating provided in `req.params.minRating`.
 * @function getSeriesByRating
 * @param {object} req - Express request object, expects `req.params.minRating`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of series or 500 error.
 * @async
 */
async function getSeriesByRating(req, res) {
  try {
    const series = await Series.find({
      rating: { $gte: parseFloat(req.params.minRating) },
    });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get series by release year range
/**
 * Retrieves series that first aired within a specified year range.
 * Uses the start and end years provided in `req.params.startYear` and `req.params.endYear`.
 * @function getSeriesByYearRange
 * @param {object} req - Express request object, expects `req.params.startYear` and `req.params.endYear`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of series or 500 error.
 * @async
 */
async function getSeriesByYearRange(req, res) {
  try {
    const series = await Series.find({
      firstAirYear: {
        $gte: parseInt(req.params.startYear),
        $lte: parseInt(req.params.endYear),
      },
    });
    res.json(series);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

module.exports = {
  getAllSeries,
  getSeriesByTitle,
  getSeriesByGenre,
  getSeriesByStatus,
  getSeriesByActor,
  getSeriesByRating,
  getSeriesByYearRange,
};
