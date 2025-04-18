// controllers/directorsController.js

const Movie = require("../models/Movie");

// Get a director by name
/**
 * Retrieves director information by name.
 * Finds a movie associated with the director name provided in request parameters.
 * @function getDirectorByName
 * @param {object} req - Express request object, expects `req.params.name`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with director data or 404/500 error.
 * @async
 */
async function getDirectorByName(req, res) {
  try {
    const movie = await Movie.findOne({ "director.name": req.params.name });
    if (movie) {
      res.json(movie.director);
    } else {
      res.status(404).send("Director not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Update the bio of a director in multiple movies
/**
 * Updates the biography of a director across all movies they directed.
 * Uses the director name from `req.params.name` and the new bio from `req.body.bio`.
 * @function updateDirectorBio
 * @param {object} req - Express request object, expects `req.params.name` and `req.body.bio`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with update status or 404/500 error.
 * @async
 */
async function updateDirectorBio(req, res) {
  try {
    const result = await Movie.updateMany(
      { "director.name": new RegExp(`^${req.params.name}$`, "i") },
      { $set: { "director.bio": req.body.bio } }
    );

    if (result.matchedCount === 0) {
      res.status(404).send("Director not found");
    } else if (result.modifiedCount === 0) {
      res.status(200).send("No changes were made to the director's bio");
    } else {
      res
        .status(200)
        .json({ message: `Updated bio for ${result.modifiedCount} movies` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get all movies by a director
/**
 * Retrieves all movies directed by a specific director.
 * Uses the director name provided in `req.params.directorName`.
 * @function getMoviesByDirector
 * @param {object} req - Express request object, expects `req.params.directorName`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of movies or 500 error.
 * @async
 */
async function getMoviesByDirector(req, res) {
  try {
    const movies = await Movie.find({
      "director.name": req.params.directorName,
    });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Export all the functions
module.exports = {
  getDirectorByName,
  updateDirectorBio,
  getMoviesByDirector,
};
