// Import Express and the movies controller
const express = require("express");
const moviesController = require("../controllers/moviesController");

// Create a router instance
const router = express.Router();

// Route to get all movies
router.get("/", moviesController.getAllMovies);

// Route to get a movie by title
router.get("/:title", moviesController.getMovieByTitle);

// Route to get movies by genre
router.get("/genre/:name", moviesController.getMoviesByGenre);

// Route to get movies by actor
router.get("/actor/:actorName", moviesController.getMoviesByActor);

// Route to get movies by year
router.get("/year/:year", moviesController.getMoviesByYear);

// Route to get movies by minimum rating
router.get("/rating/:minRating", moviesController.getMoviesByRating);

// Export the router
module.exports = router;
