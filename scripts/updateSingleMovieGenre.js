// updateGenres.js
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
require("dotenv").config({ path: "../.env" });

class GenreUpdater {
  constructor() {
    this.success = false;
  }

  async initialize() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "myFlixDB",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB database:", mongoose.connection.name);
      this.success = true;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  async updateMovieGenres(movieTitle, newGenres) {
    try {
      // Find the movie by title (case-insensitive)
      const movie = await Movie.findOne({
        $or: [
          { title: { $regex: new RegExp(`^${movieTitle}$`, "i") } },
          { referenceTitle: { $regex: new RegExp(`^${movieTitle}$`, "i") } },
        ],
      });

      if (!movie) {
        console.log(`Movie "${movieTitle}" not found in database.`);
        return false;
      }

      // Format the genres array with description
      const formattedGenres = newGenres.map((genre) => ({
        name: genre,
        description: `Movies in the ${genre} genre`,
      }));

      // Update the movie with new genres
      await Movie.updateOne(
        { _id: movie._id },
        { $set: { genres: formattedGenres } }
      );

      console.log(`Successfully updated genres for "${movie.title}"`);
      console.log("New genres:", formattedGenres.map((g) => g.name).join(", "));
      return true;
    } catch (error) {
      console.error("Error updating genres:", error);
      return false;
    }
  }

  async cleanup() {
    if (this.success) {
      await mongoose.disconnect();
      console.log("Closed database connection");
    }
  }
}

// Example usage if running directly
if (require.main === module) {
  const updater = new GenreUpdater();

  // Example genres to update (you can modify these)
  const movieTitle = "Kung Fu Panda 3";
  const newGenres = ["Family", "Animation", "Action", "Comedy", "Adventure"];

  updater
    .initialize()
    .then(() => updater.updateMovieGenres(movieTitle, newGenres))
    .then(() => updater.cleanup())
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

module.exports = GenreUpdater;
