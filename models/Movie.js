// models/Movie.js
const mongoose = require("mongoose");

/**
 * Represents a movie in the database.
 * @typedef {object} MovieSchema
 * @property {string} title - The title of the movie. Required.
 * @property {string} description - A brief description or synopsis of the movie. Required.
 * @property {Array<object>} genres - An array of genre objects associated with the movie.
 * @property {string} genres.name - The name of the genre. Required.
 * @property {object} director - Information about the movie's director.
 * @property {string} director.name - The name of the director.
 * @property {string} director.bio - A short biography of the director.
 * @property {number} director.birthYear - The birth year of the director.
 * @property {number} director.deathYear - The death year of the director (if applicable).
 * @property {Array<string>} actors - An array of actor names starring in the movie.
 * @property {string} imageURL - URL to the movie's poster or promotional image.
 * @property {boolean} featured - Indicates if the movie is featured.
 * @property {number} releaseYear - The year the movie was released.
 * @property {number} rating - The movie's rating (e.g., out of 10).
 * @property {object} trailer - Information about the movie's trailer.
 * @property {string} trailer.site - The site hosting the trailer (e.g., YouTube).
 * @property {string} trailer.key - The unique key or ID for the trailer on the site.
 * @property {string} trailer.name - The name or title of the trailer.
 * @property {boolean} trailer.official - Indicates if the trailer is official.
 * @property {string} trailer.type - The type of trailer (e.g., Teaser, Trailer).
 * @property {number} tmdbId - The Movie Database (TMDb) ID for the movie.
 */
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