// Import the database connection
const { getDB } = require("../config/db");

// Get all movies from the database
async function getAllMovies(req, res) {
  try {
    const db = getDB();
    const movies = await db.collection("movies").find().toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get a movie by its title
async function getMovieByTitle(req, res) {
  try {
    const db = getDB();
    const movie = await db
      .collection("movies")
      .findOne({ title: req.params.title });
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
    const db = getDB();
    const movies = await db
      .collection("movies")
      .find({ "genre.name": req.params.name })
      .toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get movies by actor
async function getMoviesByActor(req, res) {
  try {
    const db = getDB();
    const movies = await db
      .collection("movies")
      .find({ actors: req.params.actorName })
      .toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get movies by release year
async function getMoviesByYear(req, res) {
  try {
    const db = getDB();
    const movies = await db
      .collection("movies")
      .find({ releaseYear: parseInt(req.params.year) })
      .toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Get movies by minimum rating
async function getMoviesByRating(req, res) {
  try {
    const db = getDB();
    const movies = await db
      .collection("movies")
      .find({ rating: { $gte: parseFloat(req.params.minRating) } })
      .toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Export all functions
module.exports = {
  getAllMovies,
  getMovieByTitle,
  getMoviesByGenre,
  getMoviesByActor,
  getMoviesByYear,
  getMoviesByRating,
};
