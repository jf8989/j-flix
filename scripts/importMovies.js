// scripts/importMovies.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const TMDBService = require("../utils/tmdb");

async function importMovies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Delete all existing movies
    await Movie.deleteMany({});
    console.log("Cleared existing movies collection");

    // Read the corrected movies.json file
    const filePath = path.join(__dirname, "..", "movies-data", "movies.json");
    const movieData = JSON.parse(fs.readFileSync(filePath));

    // Process each movie
    for (const movieInfo of movieData) {
      console.log(`Processing ${movieInfo.title}...`);

      // Search TMDB for movie image
      const tmdbData = await TMDBService.searchMovie(
        movieInfo.title,
        movieInfo.releaseYear
      );

      if (tmdbData && tmdbData.imageURL) {
        movieInfo.imageURL = tmdbData.imageURL;
        console.log(`✅ Found TMDB image for ${movieInfo.title}`);
      } else {
        console.log(`⚠️ No TMDB image found for ${movieInfo.title}`);
      }

      // Create new movie document
      const movie = new Movie(movieInfo);
      await movie.save();
    }

    console.log("Successfully imported all movies with TMDB images");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

importMovies();
