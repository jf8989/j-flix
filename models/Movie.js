// models/Movie.js

const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    name: String,
    description: String,
  },
  director: {
    name: String,
    bio: String,
    birthYear: Number,
    deathYear: Number,
  },
  actors: [String],
  imagePath: String,
  featured: Boolean,
  releaseYear: Number,
  rating: Number,
});

module.exports = mongoose.model("Movie", MovieSchema);
