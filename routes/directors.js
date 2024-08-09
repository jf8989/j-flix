// Import Express and the directors controller
const express = require("express");
const directorsController = require("../controllers/directorsController");

// Create a router instance
const router = express.Router();

// Route to get director by name
router.get("/:name", directorsController.getDirectorByName);

// Route to update director's bio
router.put("/:name/bio", directorsController.updateDirectorBio);

// Route to get all movies by a director
router.get("/:directorName/movies", directorsController.getMoviesByDirector);

// Export the router
module.exports = router;
