// scripts/fixGenres.js
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
require("dotenv").config();

async function fixGenres() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "myFlixDB",
    });
    console.log("Connected to MongoDB");

    // Get all movies
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies to process`);

    for (const movie of movies) {
      // Initialize genres array if it doesn't exist
      if (!movie.genres) {
        movie.genres = [];
      }

      // If there's an old genre field, add it to genres array if not already there
      if (movie.genre && movie.genre.name) {
        const existingGenre = movie.genres.find(
          (g) => g.name.toLowerCase() === movie.genre.name.toLowerCase()
        );

        if (!existingGenre) {
          movie.genres.push({
            name: movie.genre.name,
            description:
              movie.genre.description ||
              `Movies in the ${movie.genre.name} genre`,
          });
        }
      }

      // Remove the old genre field
      movie.genre = undefined;

      // Save the updated movie
      const updated = await Movie.findByIdAndUpdate(
        movie._id,
        {
          $unset: { genre: "" },
          $set: { genres: movie.genres },
        },
        { new: true }
      );

      console.log(`Updated "${movie.title}": ${updated.genres.length} genres`);
    }

    console.log("Genre migration completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

fixGenres();
