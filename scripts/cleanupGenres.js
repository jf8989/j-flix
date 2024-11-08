// scripts/cleanupGenres.js

const mongoose = require("mongoose");
const Movie = require("../models/Movie");
require("dotenv").config();

async function cleanupGenres() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "myFlixDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB database:", mongoose.connection.name);

    // Get all movies
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies to process`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const movie of movies) {
      try {
        // Keep track of changes made
        let changes = [];

        // Remove the old single genre field if it exists
        if (movie.genre !== undefined) {
          movie.genre = undefined;
          changes.push("removed old genre field");
        }

        // Ensure genres exists as an array
        if (!Array.isArray(movie.genres)) {
          movie.genres = [];
          changes.push("initialized genres array");
        }

        // Remove description from each genre in the array
        if (movie.genres.length > 0) {
          movie.genres = movie.genres.map((genre) => ({
            name: genre.name,
          }));
          changes.push("removed genre descriptions");
        }

        // Only save if changes were made
        if (changes.length > 0) {
          await movie.save();
          console.log(`Updated "${movie.title}": ${changes.join(", ")}`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error processing "${movie.title}":`, error.message);
        errorCount++;
      }
    }

    // Print summary
    console.log("\nMigration Summary:");
    console.log(`Total movies processed: ${movies.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDatabase connection closed");
  }
}

// Run the migration
cleanupGenres();
