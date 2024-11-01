// scripts/exportMovies.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");

async function exportMovies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const movies = await Movie.find({});

    // Create movies-data directory if it doesn't exist
    const exportDir = path.join(__dirname, "..", "movies-data");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // Write to movies.json in the movies-data directory
    const filePath = path.join(exportDir, "movies.json");
    fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));

    console.log(`Movies exported to: ${filePath}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

exportMovies();
