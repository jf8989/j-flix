// addTrailers.js
/*
Purpose: Updates existing movies in the database by adding trailer information from TMDB API
Usage Scenarios:
- When you need to add missing trailer information to existing movies
- When you want to update trailer information for movies that already exist
- Best used as a one-time migration script to add trailers to all movies

Key Features:
- Processes all movies in the database
- Skips movies that already have trailers
- Uses TMDB API to fetch trailer data
- Includes detailed logging and error handling
*/
const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
require("dotenv").config({ path: "../.env" });

class TrailerMigration {
  constructor() {
    this.tmdbApiKey = process.env.TMDB_API_KEY;
    this.tmdbBaseUrl =
      process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
    this.processed = 0;
    this.updated = 0;
    this.errors = 0;
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
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  async getMovieTrailer(tmdbId) {
    try {
      const response = await axios.get(
        `${this.tmdbBaseUrl}/movie/${tmdbId}/videos`,
        {
          params: { api_key: this.tmdbApiKey },
          headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
        }
      );

      const videos = response.data.results;

      // Look for official trailers first
      const officialTrailer = videos.find(
        (video) =>
          video.type === "Trailer" &&
          video.site === "YouTube" &&
          video.official === true
      );

      // If no official trailer, look for any trailer
      const anyTrailer = videos.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      // Use the first video if no trailers found
      const firstVideo = videos.find((video) => video.site === "YouTube");

      // Select the best available video
      const selectedVideo = officialTrailer || anyTrailer || firstVideo;

      if (selectedVideo) {
        return {
          site: selectedVideo.site,
          key: selectedVideo.key,
          name: selectedVideo.name,
          official: selectedVideo.official || false,
          type: selectedVideo.type,
        };
      }

      return null;
    } catch (error) {
      console.error(
        `Error fetching trailer for TMDB ID ${tmdbId}:`,
        error.message
      );
      return null;
    }
  }

  async processMovie(movie) {
    try {
      this.processed++;

      // Skip if movie already has a trailer
      if (movie.trailer && movie.trailer.key) {
        console.log(
          `Movie "${movie.title}" already has a trailer. Skipping...`
        );
        return;
      }

      // Skip if movie doesn't have a TMDB ID
      if (!movie.tmdbId) {
        console.log(`Movie "${movie.title}" has no TMDB ID. Skipping...`);
        return;
      }

      console.log(`Processing "${movie.title}"...`);

      const trailer = await this.getMovieTrailer(movie.tmdbId);

      if (trailer) {
        await Movie.updateOne(
          { _id: movie._id },
          { $set: { trailer: trailer } }
        );
        this.updated++;
        console.log(`Added trailer for "${movie.title}"`);
        console.log("Trailer details:", trailer);
      } else {
        console.log(`No suitable trailer found for "${movie.title}"`);
      }
    } catch (error) {
      this.errors++;
      console.error(`Error processing "${movie.title}":`, error.message);
    }
  }

  async migrateTrailers() {
    try {
      const movies = await Movie.find({});
      console.log(`Found ${movies.length} movies to process`);

      for (const movie of movies) {
        await this.processMovie(movie);
        // Rate limit delay (250ms between requests)
        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      console.log("\nMigration Summary:");
      console.log("-----------------");
      console.log(`Total movies processed: ${this.processed}`);
      console.log(`Movies updated with trailers: ${this.updated}`);
      console.log(`Errors encountered: ${this.errors}`);
    } catch (error) {
      console.error("Migration error:", error);
    } finally {
      await this.cleanup();
    }
  }

  async cleanup() {
    await mongoose.disconnect();
    console.log("\nClosed database connection");
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  const migration = new TrailerMigration();
  migration
    .initialize()
    .then(() => migration.migrateTrailers())
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

module.exports = TrailerMigration;
