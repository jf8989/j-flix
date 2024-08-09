// controllers/usersController.js

const mongoose = require("mongoose");
const User = mongoose.model("User");

// Register a new user
async function registerUser(req, res) {
  try {
    const newUser = new User(req.body);
    const result = await newUser.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Update user information
async function updateUserInfo(req, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: req.body },
      { new: true }
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Add a movie to a user's favorites
async function addMovieToFavorites(req, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      { $addToSet: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found or movie already in favorites");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Remove a movie from a user's favorites
async function removeMovieFromFavorites(req, res) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { favoriteMovies: req.params.movieId } },
      { new: true }
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found or movie not in favorites");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

// Delete a user by username
async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findOneAndDelete({
      username: req.params.username,
    });
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
}

module.exports = {
  registerUser,
  updateUserInfo,
  addMovieToFavorites,
  removeMovieFromFavorites,
  deleteUser,
};
