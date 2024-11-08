const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("./models/Movie");
require("dotenv").config();

const tmdbApiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

async function checkAndRemoveDuplicates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Get all movies from database
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies to process`);

    // Create a map to store TMDB IDs and corresponding MongoDB documents
    const movieMap = new Map();
    const duplicates = [];

    for (const movie of movies) {
      try {
        // Search for movie on TMDB
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
          // Find best match based on title
          const bestMatch =
            results.find(
              (result) =>
                result.title.toLowerCase() === movie.title.toLowerCase()
            ) || results[0];

          const tmdbId = bestMatch.id;

          // If we've seen this TMDB ID before, we have a duplicate
          if (movieMap.has(tmdbId)) {
            duplicates.push({
              tmdbId,
              originalMovie: movieMap.get(tmdbId),
              duplicateMovie: movie,
            });
          } else {
            movieMap.set(tmdbId, movie);
          }

          console.log(`Processed "${movie.title}" (TMDB ID: ${tmdbId})`);
        } else {
          console.log(`No TMDB results found for "${movie.title}"`);
        }

        // Add delay to respect TMDB rate limits
        await new Promise((resolve) => setTimeout(resolve, 250));
      } catch (error) {
        console.error(`Error processing "${movie.title}":`, error.message);
      }
    }

    // Log findings
    console.log(`\nFound ${duplicates.length} potential duplicates:`);

    // Handle duplicates
    for (const duplicate of duplicates) {
      console.log(`\nDuplicate found for TMDB ID ${duplicate.tmdbId}:`);
      console.log(
        `Original: "${duplicate.originalMovie.title}" (ID: ${duplicate.originalMovie._id})`
      );
      console.log(
        `Duplicate: "${duplicate.duplicateMovie.title}" (ID: ${duplicate.duplicateMovie._id})`
      );

      try {
        // Delete the duplicate entry
        await Movie.findByIdAndDelete(duplicate.duplicateMovie._id);
        console.log(
          `Deleted duplicate movie: ${duplicate.duplicateMovie.title}`
        );
      } catch (error) {
        console.error(`Error deleting duplicate:`, error.message);
      }
    }

    await mongoose.disconnect();
    console.log("\nFinished processing duplicates");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkAndRemoveDuplicates();
