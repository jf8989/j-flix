// updateMovieImages.js

const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../models/Movie"); // Adjust the path if necessary
require("dotenv").config(); // To access environment variables

const tmdbApiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const tmdbImageBaseUrl =
  process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";

async function updateMovieImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch all movies from the database
    const movies = await Movie.find();

    for (const movie of movies) {
      try {
        // Skip if imageURL is already set
        if (movie.imageURL && !movie.imageURL.includes("placeholder")) {
          console.log(`Image already exists for "${movie.title}", skipping...`);
          continue;
        }

        // Search for the movie on TMDB
        const searchResponse = await axios.get(`${tmdbBaseUrl}/search/movie`, {
          params: {
            api_key: tmdbApiKey,
            query: movie.title,
          },
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          },
        });

        const results = searchResponse.data.results;

        if (results && results.length > 0) {
          // Find the best match
          const bestMatch =
            results.find(
              (result) =>
                result.title.toLowerCase() === movie.title.toLowerCase()
            ) || results[0];

          if (bestMatch.poster_path) {
            const imageUrl = `${tmdbImageBaseUrl}${bestMatch.poster_path}`;
            // Update the movie document
            movie.imageURL = imageUrl;
            await movie.save();
            console.log(`Updated image for "${movie.title}"`);
          } else {
            console.log(`No poster found for "${movie.title}"`);
          }
        } else {
          console.log(`No results found for "${movie.title}"`);
        }
      } catch (error) {
        console.error(`Error updating "${movie.title}":`, error.message);
      }
    }

    // Close the database connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

updateMovieImages();
