const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
require("dotenv").config();

const tmdbApiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

async function updateMovieGenres() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch TMDB genre list once to use as reference
    const genreResponse = await axios.get(`${tmdbBaseUrl}/genre/movie/list`, {
      params: { api_key: tmdbApiKey },
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });

    // Create a map of genre IDs to their full information
    const genreMap = new Map(
      genreResponse.data.genres.map((genre) => [
        genre.id,
        {
          name: genre.name,
          description: `Movies in the ${genre.name} genre`,
        },
      ])
    );

    // Fetch all movies from the database
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies to process`);

    // Process each movie
    for (const movie of movies) {
      try {
        console.log(`\nProcessing "${movie.title}"...`);

        // Search for movie on TMDB
        const searchResponse = await axios.get(`${tmdbBaseUrl}/search/movie`, {
          params: {
            api_key: tmdbApiKey,
            query: movie.title,
            year: movie.releaseYear, // Add year to improve match accuracy
          },
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          },
        });

        const results = searchResponse.data.results;

        if (results && results.length > 0) {
          // Find best match by comparing titles and release years
          const bestMatch =
            results.find((result) => {
              const titleMatch =
                result.title.toLowerCase() === movie.title.toLowerCase();
              const yearMatch =
                result.release_date &&
                new Date(result.release_date).getFullYear() ===
                  movie.releaseYear;
              return titleMatch && yearMatch;
            }) || results[0]; // Fallback to first result if no exact match

          // Get detailed movie info
          const movieDetails = await axios.get(
            `${tmdbBaseUrl}/movie/${bestMatch.id}`,
            {
              params: { api_key: tmdbApiKey },
              headers: {
                Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
              },
            }
          );

          // Initialize arrays for storing genres
          const updatedGenres = [];
          const genreNames = new Set(); // Track unique genre names

          // First, preserve any existing genre if it exists
          if (movie.genre?.name) {
            genreNames.add(movie.genre.name.toLowerCase());
            updatedGenres.push(movie.genre);
          }

          // Add all genres from TMDB that aren't already present
          for (const tmdbGenre of movieDetails.data.genres) {
            const genreInfo = genreMap.get(tmdbGenre.id);
            if (genreInfo && !genreNames.has(genreInfo.name.toLowerCase())) {
              genreNames.add(genreInfo.name.toLowerCase());
              updatedGenres.push({
                name: genreInfo.name,
                description: genreInfo.description,
              });
            }
          }

          // Update the movie document
          const oldGenresCount = movie.genres?.length || (movie.genre ? 1 : 0);

          // Update both the legacy genre field and the new genres array
          movie.genre = updatedGenres[0] || null; // Keep the first genre in the legacy field
          movie.genres = updatedGenres; // Store all genres in the new field

          await movie.save();

          console.log(`Updated "${movie.title}":`, {
            oldCount: oldGenresCount,
            newCount: updatedGenres.length,
            genres: updatedGenres.map((g) => g.name).join(", "),
          });
        } else {
          console.log(`No TMDB results found for "${movie.title}"`);
        }

        // Add a small delay to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error updating "${movie.title}":`, error.message);

        // Log full error details for debugging
        if (error.response) {
          console.error("Error response:", {
            status: error.response.status,
            data: error.response.data,
          });
        }
      }
    }

    await mongoose.disconnect();
    console.log("\nFinished updating movie genres");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

// Execute the update
updateMovieGenres();
