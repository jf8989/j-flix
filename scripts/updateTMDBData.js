// updateTMDBData.js
// to update names and ID's for each of the movies in the database
const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
require("dotenv").config({ path: "../.env" });

class TMDBDataUpdater {
  constructor() {
    this.tmdbApiKey = process.env.TMDB_API_KEY;
    this.tmdbBaseUrl =
      process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
  }

  async initialize() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "myFlixDB",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB database:", mongoose.connection.name);
    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }
  }

  async findTMDBData(movie) {
    try {
      const searchResponse = await axios.get(
        `${this.tmdbBaseUrl}/search/movie`,
        {
          params: {
            api_key: this.tmdbApiKey,
            query: movie.title,
            year: movie.releaseYear,
          },
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          },
        }
      );

      const results = searchResponse.data.results;

      if (!results || results.length === 0) {
        return null;
      }

      // Try to find exact match first
      const exactMatch = results.find((result) => {
        const titleMatch =
          result.title.toLowerCase() === movie.title.toLowerCase();
        const yearMatch =
          !movie.releaseYear ||
          new Date(result.release_date).getFullYear() === movie.releaseYear;
        return titleMatch && yearMatch;
      });

      const bestMatch = exactMatch || results[0];

      // Get full movie details including videos
      const movieDetails = await axios.get(
        `${this.tmdbBaseUrl}/movie/${bestMatch.id}`,
        {
          params: {
            api_key: this.tmdbApiKey,
            append_to_response: "videos",
          },
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          },
        }
      );

      // Process trailer
      let trailer = null;
      if (movieDetails.data.videos && movieDetails.data.videos.results) {
        const officialTrailer = movieDetails.data.videos.results.find(
          (video) =>
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.official === true
        );

        const anyTrailer = movieDetails.data.videos.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        const firstVideo = movieDetails.data.videos.results.find(
          (video) => video.site === "YouTube"
        );

        const selectedVideo = officialTrailer || anyTrailer || firstVideo;

        if (selectedVideo) {
          trailer = {
            site: selectedVideo.site,
            key: selectedVideo.key,
            name: selectedVideo.name,
            official: selectedVideo.official || false,
            type: selectedVideo.type,
          };
        }
      }

      return {
        tmdbId: bestMatch.id,
        officialTitle: movieDetails.data.title,
        trailer: trailer,
      };
    } catch (error) {
      console.error(`Error searching for "${movie.title}":`, error.message);
      return null;
    }
  }

  async updateMovies() {
    try {
      // Get all movies that need updating (no tmdbId OR no trailer)
      const movies = await Movie.find({
        $or: [{ tmdbId: { $exists: false } }, { trailer: { $exists: false } }],
      });

      console.log(`Found ${movies.length} movies to update`);

      let updatedCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      for (const movie of movies) {
        try {
          console.log(`\nProcessing: "${movie.title}"`);

          const tmdbData = await this.findTMDBData(movie);

          if (tmdbData) {
            const updates = {};

            // Store original title as reference if different
            if (movie.title !== tmdbData.officialTitle) {
              updates.referenceTitle = movie.title;
              updates.title = tmdbData.officialTitle;
              console.log(
                `Title updated: "${movie.title}" -> "${tmdbData.officialTitle}"`
              );
            }

            // Update TMDB ID if missing
            if (!movie.tmdbId) {
              updates.tmdbId = tmdbData.tmdbId;
              console.log(`Added TMDB ID: ${tmdbData.tmdbId}`);
            }

            // Update trailer if available
            if (tmdbData.trailer) {
              updates.trailer = tmdbData.trailer;
              console.log(`Added trailer: ${tmdbData.trailer.name}`);
            }

            // Only update if there are changes
            if (Object.keys(updates).length > 0) {
              await Movie.updateOne({ _id: movie._id }, { $set: updates });
              updatedCount++;
              console.log("Successfully updated");
            } else {
              skippedCount++;
              console.log("No updates needed");
            }
          } else {
            console.log(`Could not find TMDB data for "${movie.title}"`);
            errorCount++;
          }

          // Rate limit delay
          await new Promise((resolve) => setTimeout(resolve, 250));
        } catch (error) {
          console.error(`Error updating "${movie.title}":`, error.message);
          errorCount++;
        }
      }

      console.log("\nUpdate Summary:");
      console.log(`Total movies processed: ${movies.length}`);
      console.log(`Successfully updated: ${updatedCount}`);
      console.log(`No updates needed: ${skippedCount}`);
      console.log(`Errors/Not found: ${errorCount}`);
    } catch (error) {
      console.error("Error updating movies:", error);
    }
  }

  async cleanup() {
    await mongoose.disconnect();
    console.log("Database connection closed");
  }
}

// Run the updater
if (require.main === module) {
  const updater = new TMDBDataUpdater();
  updater
    .initialize()
    .then(() => updater.updateMovies())
    .then(() => updater.cleanup())
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

module.exports = TMDBDataUpdater;
