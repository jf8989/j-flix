// controllers/usersController.js
const mongoose = require("mongoose");
const User = require("../models/User");
const Movie = require("../models/Movie"); // Add this line to import the Movie model

// Register a new user
async function registerUser(req, res) {
  try {
    const { username, password, email, birthday } = req.body;

    // Convert username to lowercase to avoid case sensitivity issues
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

    console.log("Password before hashing:", password);
    const hashedPassword = User.hashPassword(password);
    console.log("Password after hashing:", hashedPassword);

    const newUser = new User({
      Username: lowerUsername, // Save username in lowercase
      Password: hashedPassword,
      Email: email,
      Birthday: birthday,
    });

    // Save the new user to the database
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
    console.error("Error in user registration:", err);
    res.status(500).json({ message: "Error: " + err.message });
  }
}

// Update user information
async function updateUserInfo(req, res) {
  try {
    const lowerUsername = req.params.username.toLowerCase(); // Convert to lowercase

    const updatedUser = await User.findOneAndUpdate(
      { Username: lowerUsername }, // Query using lowercase username
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
    const lowerUsername = req.params.username.toLowerCase(); // Convert to lowercase

    // Log the full request object to see what's being passed
    console.log("Full Request Params:", req.params);

    // Check if movieID is being received
    console.log("Movie ID received:", req.params.movieID);

    // Convert the movie ID to ObjectId
    const movieID = new mongoose.Types.ObjectId(req.params.movieID);

    // Check if the movie exists in the Movie collection
    const movie = await Movie.findById(movieID);

    if (!movie) {
      console.log("Movie not found in the database");
      return res.status(404).json({ message: "Movie not found" });
    }

    console.log("Movie found:", movie.title); // Log the found movie details

    // Proceed to update the user's favorite movies
    const updatedUser = await User.findOneAndUpdate(
      { Username: lowerUsername },
      { $addToSet: { FavoriteMovies: movieID } },
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
    const lowerUsername = req.params.username.toLowerCase(); // Convert to lowercase

    const updatedUser = await User.findOneAndUpdate(
      { Username: lowerUsername }, // Query using lowercase username
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
    const lowerUsername = req.params.username.toLowerCase(); // Convert to lowercase

    const deletedUser = await User.findOneAndDelete({
      Username: lowerUsername, // Query using lowercase username
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
