// controllers/usersController.js
const mongoose = require("mongoose");
const User = require("../models/User");
const Movie = require("../models/Movie"); // Add this line to import the Movie model
const { validationResult } = require("express-validator"); // Add validation result handling

// Register a new user
async function registerUser(req, res) {
  // Check for validation errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { username, password, email, birthday } = req.body;
    const lowerUsername = username.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ Username: lowerUsername }, { Email: email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    const hashedPassword = User.hashPassword(password);

    const newUser = new User({
      Username: lowerUsername,
      Password: hashedPassword,
      Email: email,
      Birthday: birthday,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      user: {
        _id: savedUser._id,
        Username: savedUser.Username,
        Email: savedUser.Email,
        Birthday: savedUser.Birthday,
      },
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  }
}

// Update user information (partial updates)
async function updateUserInfo(req, res) {
  // Check for validation errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const lowerUsername = req.params.username.toLowerCase();

    // Ensure req.body only has fields that need updating
    const updatedFields = {};
    if (req.body.username)
      updatedFields.Username = req.body.username.toLowerCase();
    if (req.body.password)
      updatedFields.Password = User.hashPassword(req.body.password);
    if (req.body.email) updatedFields.Email = req.body.email;
    if (req.body.birthday) updatedFields.Birthday = new Date(req.body.birthday);

    // Perform the update using only the updatedFields
    const updatedUser = await User.findOneAndUpdate(
      { Username: lowerUsername },
      { $set: updatedFields }, // Only update the fields passed in req.body
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
}

// Add a movie to a user's favorites
async function addMovieToFavorites(req, res) {
  try {
    const lowerUsername = req.params.username.toLowerCase();
    const { movieID } = req.params;

    // Check if movieID is already an ObjectId or convert it if not
    let validMovieID;
    if (mongoose.Types.ObjectId.isValid(movieID)) {
      // Convert to ObjectId only if it's a valid ObjectId format
      validMovieID = new mongoose.Types.ObjectId(movieID);
    } else {
      // Leave it as a string if it's not a valid ObjectId format
      validMovieID = movieID;
    }

    // Check if the movie exists in the Movie collection
    const movie = await Movie.findOne({ _id: validMovieID });

    if (!movie) {
      console.log("Movie not found in the database");
      return res.status(404).json({ message: "Movie not found" });
    }

    console.log("Movie found:", movie.title);

    // Update user's favorite movies
    const updatedUser = await User.findOneAndUpdate(
      { Username: lowerUsername },
      { $addToSet: { FavoriteMovies: validMovieID } },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found or movie already in favorites");
    }
  } catch (err) {
    console.error("Error adding movie to favorites:", err);
    res.status(500).send("Error: " + err);
  }
}

// Remove a movie from a user's favorites
async function removeMovieFromFavorites(req, res) {
  try {
    const lowerUsername = req.params.username.toLowerCase();
    const { movieID } = req.params;

    let validMovieID;
    if (mongoose.Types.ObjectId.isValid(movieID)) {
      validMovieID = new mongoose.Types.ObjectId(movieID);
    } else {
      validMovieID = movieID;
    }

    const updatedUser = await User.findOneAndUpdate(
      { Username: lowerUsername },
      { $pull: { FavoriteMovies: validMovieID } },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found or movie not in favorites");
    }
  } catch (err) {
    console.error("Error removing movie from favorites:", err);
    res.status(500).send("Error: " + err);
  }
}

// Delete a user by username
async function deleteUser(req, res) {
  try {
    const lowerUsername = req.params.username.toLowerCase();
    console.log("Deleting user:", lowerUsername);

    const deletedUser = await User.findOneAndDelete({
      Username: lowerUsername,
    });
    if (deletedUser) {
      console.log("User deleted:", deletedUser.Username);
      res.json({ message: "User deleted successfully" });
    } else {
      console.log("User not found");
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error("Error deleting user:", err);
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
