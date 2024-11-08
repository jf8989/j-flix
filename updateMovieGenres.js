const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("./models/Movie");
require("dotenv").config();

const tmdbApiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

async function updateMovieGenres() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch TMDB genre list once
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
          description: `Movies in the ${genre.name} genre`, // Customize as needed
        },
      ])
    );

    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies to process`);

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
          // Find best match
          const bestMatch =
            results.find(
              (result) =>
                result.title.toLowerCase() === movie.title.toLowerCase()
            ) || results[0];

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

          // Create a Set of genre names for uniqueness check
          const uniqueGenres = new Set();
          const updatedGenres = [];

          // First, add existing genre if it exists
          if (movie.genre?.name) {
            uniqueGenres.add(movie.genre.name.toLowerCase());
            updatedGenres.push(movie.genre);
          }

          // Add new genres from TMDB, avoiding duplicates
          movieDetails.data.genres.forEach((tmdbGenre) => {
            const genreInfo = genreMap.get(tmdbGenre.id);
            if (genreInfo && !uniqueGenres.has(genreInfo.name.toLowerCase())) {
              uniqueGenres.add(genreInfo.name.toLowerCase());
              updatedGenres.push(genreInfo);
            }
          });

          // Update movie document with unique genres
          const oldGenresCount = movie.genres?.length || 0;
          movie.genres = updatedGenres;
          await movie.save();

          console.log(
            `Updated "${movie.title}": ${oldGenresCount} -> ${updatedGenres.length} genres`
          );
        } else {
          console.log(`No results found for "${movie.title}"`);
        }
      } catch (error) {
        console.error(`Error updating "${movie.title}":`, error.message);
      }
    }

    await mongoose.disconnect();
    console.log("Finished updating movie genres");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

updateMovieGenres();
