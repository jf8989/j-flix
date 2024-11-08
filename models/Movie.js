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
  genres: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  director: {
    name: String,
    bio: String,
    birthYear: Number,
    deathYear: Number,
  },
  actors: [String],
  imageURL: String,
  featured: Boolean,
  releaseYear: Number,
  rating: Number,
});

module.exports = mongoose.model("Movie", MovieSchema);
