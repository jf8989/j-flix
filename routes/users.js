// users.js

// Import Express and the users controller
const express = require("express");
const usersController = require("../controllers/usersController");

// Create a router instance
const router = express.Router();

// Route to register a new user
router.post("/", usersController.registerUser);

// Route to update user info
router.put("/:username", usersController.updateUserInfo);

// Route to add a movie to a user's favorites
router.post("/:username/movies/:movieId", usersController.addMovieToFavorites);

// Route to remove a movie from a user's favorites
router.delete("/:username/movies/:movieId", usersController.removeMovieFromFavorites);

// Route to delete a user
router.delete("/:username", usersController.deleteUser);

// Export the router
module.exports = router;
