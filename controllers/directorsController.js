// controllers/directorsController.js

const Movie = require("../models/Movie");

// Get a director by name
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
