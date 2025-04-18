// controllers/moviesController.js

const mongoose = require("mongoose");
const Movie = require("../models/Movie");

// Get all movies from the database
/**
 * Retrieves all movies from the database.
 * @function getAllMovies
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of all movies or 500 error.
 * @async
 */
async function getAllMovies(req, res) {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get a movie by its title
/**
 * Retrieves a single movie by its title.
 * Uses the title provided in `req.params.title`.
 * @function getMovieByTitle
 * @param {object} req - Express request object, expects `req.params.title`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with the movie data or 404/500 error.
 * @async
 */
async function getMovieByTitle(req, res) {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get movies by genre
/**
 * Retrieves movies belonging to a specific genre.
 * Uses the genre name provided in `req.params.name`.
 * @function getMoviesByGenre
 * @param {object} req - Express request object, expects `req.params.name`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of movies or 500 error.
 * @async
 */
async function getMoviesByGenre(req, res) {
  try {
    const genreName = req.params.name;
    const movies = await Movie.find({
      "genres.name": genreName,
    });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get movies by actor
/**
 * Retrieves movies featuring a specific actor.
 * Uses the actor name provided in `req.params.actorName`.
 * @function getMoviesByActor
 * @param {object} req - Express request object, expects `req.params.actorName`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of movies or 500 error.
 * @async
 */
async function getMoviesByActor(req, res) {
  try {
    const movies = await Movie.find({ actors: req.params.actorName });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get movies by release year
/**
 * Retrieves movies released in a specific year.
 * Uses the year provided in `req.params.year`.
 * @function getMoviesByYear
 * @param {object} req - Express request object, expects `req.params.year`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of movies or 500 error.
 * @async
 */
async function getMoviesByYear(req, res) {
  try {
    const movies = await Movie.find({ releaseYear: parseInt(req.params.year) });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get movies by minimum rating
/**
 * Retrieves movies with a rating greater than or equal to a minimum value.
 * Uses the minimum rating provided in `req.params.minRating`.
 * @function getMoviesByRating
 * @param {object} req - Express request object, expects `req.params.minRating`.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with an array of movies or 500 error.
 * @async
 */
async function getMoviesByRating(req, res) {
  try {
    const movies = await Movie.find({
      rating: { $gte: parseFloat(req.params.minRating) },
    });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

module.exports = {
  getAllMovies,
  getMovieByTitle,
  getMoviesByGenre,
  getMoviesByActor,
  getMoviesByYear,
  getMoviesByRating,
};
