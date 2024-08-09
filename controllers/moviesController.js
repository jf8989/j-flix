// controllers/moviesController.js

const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

// Get all movies from the database
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
async function getMoviesByGenre(req, res) {
  try {
    const movies = await Movie.find({ "genre.name": req.params.name });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get movies by actor
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
async function getMoviesByRating(req, res) {
  try {
    const movies = await Movie.find({ rating: { $gte: parseFloat(req.params.minRating) } });
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