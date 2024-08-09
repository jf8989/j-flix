// Import the database connection and ObjectId
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// Register a new user
async function registerUser(req, res) {
  try {
    const db = getDB();
    const newUser = req.body;
    const result = await db.collection("users").insertOne(newUser);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Update user information
async function updateUserInfo(req, res) {
  try {
    const db = getDB();
    const updatedUser = req.body;
    const result = await db
      .collection("users")
      .updateOne({ username: req.params.username }, { $set: updatedUser });
    if (result.modifiedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.json({ message: "User updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Add a movie to a user's favorites
async function addMovieToFavorites(req, res) {
  try {
    const db = getDB();
    const result = await db
      .collection("users")
      .updateOne(
        { username: req.params.username },
        { $addToSet: { favoriteMovies: new ObjectId(req.params.movieId) } }
      );
    if (result.modifiedCount === 0) {
      res.status(404).send("User not found or movie already in favorites");
    } else {
      res.status(200).send("Movie added to favorites");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Remove a movie from a user's favorites
async function removeMovieFromFavorites(req, res) {
  try {
    const db = getDB();
    const result = await db
      .collection("users")
      .updateOne(
        { username: req.params.username },
        { $pull: { favoriteMovies: new ObjectId(req.params.movieId) } }
      );
    if (result.modifiedCount === 0) {
      res.status(404).send("User not found or movie not in favorites");
    } else {
      res.status(200).send("Movie removed from favorites");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Delete a user by username
async function deleteUser(req, res) {
  try {
    const db = getDB();
    const result = await db
      .collection("users")
      .deleteOne({ username: req.params.username });
    if (result.deletedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.json({ message: "User deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Export all functions
module.exports = {
  registerUser,
  updateUserInfo,
  addMovieToFavorites,
  removeMovieFromFavorites,
  deleteUser,
};
