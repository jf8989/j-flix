// Import the database connection and ObjectId
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// Get a director by name
async function getDirectorByName(req, res) {
  try {
    const db = getDB();
    const movie = await db
      .collection("movies")
      .findOne({ "director.name": req.params.name });
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
    const db = getDB();
    const result = await db.collection("movies").updateMany(
      {
        "director.name": { $regex: new RegExp(`^${req.params.name}$`, "i") },
      },
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
    const db = getDB();
    const movies = await db
      .collection("movies")
      .find({ "director.name": req.params.directorName })
      .toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Add a movie to a director's filmography
async function addMovieToFilmography(req, res) {
  try {
    const db = getDB();
    const result = await db
      .collection("directors")
      .updateOne(
        { name: req.params.directorName },
        { $addToSet: { movies: new ObjectId(req.params.movieId) } }
      );
    if (result.modifiedCount === 0) {
      res
        .status(404)
        .send("Director not found or movie already in filmography");
    } else {
      res.json({
        message: "Movie added to director's filmography successfully",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Export all functions
module.exports = {
  getDirectorByName,
  updateDirectorBio,
  getMoviesByDirector,
  addMovieToFilmography,
};
