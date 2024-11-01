// controllers/moviesController.js

const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const TMDBService = require("../utils/tmdb");

// Get all movies from the database
async function getAllMovies(req, res) {
  try {
    // First, just get the movies without TMDB updates
    const movies = await Movie.find();

    if (!movies || movies.length === 0) {
      return res.json([]);
    }

    // Send initial response
    res.json(movies);

    // Update TMDB images in background
    movies.forEach(async (movie) => {
      try {
        if (!movie.imageURL || movie.imageURL.includes("placeholder")) {
          const tmdbData = await TMDBService.searchMovie(
            movie.title,
            movie.releaseYear
          );
          if (tmdbData?.imageURL) {
            await Movie.findByIdAndUpdate(
              movie._id,
              { imageURL: tmdbData.imageURL },
              { new: true }
            );
          }
        }
      } catch (tmdbError) {
        console.error(`TMDB update error for ${movie.title}:`, tmdbError);
      }
    });
  } catch (err) {
    console.error("Error in getAllMovies:", err);
    res.status(500).json({
      message: "Error fetching movies",
      error: err.message,
    });
  }
}

// Get a movie by its title
async function getMovieByTitle(req, res) {
  try {
    const movie = await Movie.findOne({ title: req.params.title });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (err) {
    console.error("Error in getMovieByTitle:", err);
    res.status(500).json({
      message: "Error fetching movie",
      error: err.message,
    });
  }
}

// Get movies by genre
async function getMoviesByGenre(req, res) {
  try {
    const movies = await Movie.find({ "genre.name": req.params.name });
    res.json(movies || []); // Return empty array if no movies found
  } catch (err) {
    console.error("Error in getMoviesByGenre:", err);
    res.status(500).json({
      message: "Error fetching movies by genre",
      error: err.message,
    });
  }
}

// Get movies by actor
async function getMoviesByActor(req, res) {
  try {
    const movies = await Movie.find({ actors: req.params.actorName });
    res.json(movies || []); // Return empty array if no movies found
  } catch (err) {
    console.error("Error in getMoviesByActor:", err);
    res.status(500).json({
      message: "Error fetching movies by actor",
      error: err.message,
    });
  }
}

// Get movies by release year
async function getMoviesByYear(req, res) {
  try {
    const movies = await Movie.find({ releaseYear: parseInt(req.params.year) });
    res.json(movies || []); // Return empty array if no movies found
  } catch (err) {
    console.error("Error in getMoviesByYear:", err);
    res.status(500).json({
      message: "Error fetching movies by year",
      error: err.message,
    });
  }
}

// Get movies by minimum rating
async function getMoviesByRating(req, res) {
  try {
    const movies = await Movie.find({
      rating: { $gte: parseFloat(req.params.minRating) },
    });
    res.json(movies || []); // Return empty array if no movies found
  } catch (err) {
    console.error("Error in getMoviesByRating:", err);
    res.status(500).json({
      message: "Error fetching movies by rating",
      error: err.message,
    });
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
