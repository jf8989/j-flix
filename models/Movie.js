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
  // Let's properly define each field type in the trailer object
  trailer: {
    site: { type: String },
    key: { type: String },
    name: { type: String },
    official: { type: Boolean },
    type: { type: String }
  },
  tmdbId: { type: Number }
});

module.exports = mongoose.model("Movie", MovieSchema);