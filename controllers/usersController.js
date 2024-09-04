// controllers/usersController.js
const User = require("../models/User");

// Register a new user
async function registerUser(req, res) {
  try {
    const { Username, Password, Email, Birthday } = req.body;

    const hashedPassword = User.hashPassword(Password);

    const newUser = new User({
      Username: Username,
      Password: hashedPassword,
      Email: Email,
      Birthday: Birthday,
    });

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
      { Username: req.params.Username },
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
      { Username: req.params.Username },
      { $addToSet: { FavoriteMovies: req.params.MovieID } },
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
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
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
      Username: req.params.Username,
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
