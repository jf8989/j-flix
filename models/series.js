// models/Series.js
const mongoose = require("mongoose");

/**
 * Represents a TV series in the database.
 * @typedef {object} SeriesSchema
 * @property {string} title - The title of the series. Required.
 * @property {string} referenceTitle - A reference title, possibly for internal use or linking. Required.
 * @property {string} description - A brief description or synopsis of the series. Required.
 * @property {object} creator - Information about the series' creator.
 * @property {string} creator.name - The name of the creator.
 * @property {string} creator.bio - A short biography of the creator.
 * @property {number} creator.birthYear - The birth year of the creator.
 * @property {number} creator.deathYear - The death year of the creator (if applicable).
 * @property {Array<string>} actors - An array of actor names starring in the series.
 * @property {string} imageURL - URL to the series' poster or promotional image.
 * @property {boolean} featured - Indicates if the series is featured.
 * @property {number} firstAirYear - The year the series first aired.
 * @property {number} lastAirYear - The year the series last aired (if applicable).
 * @property {number} rating - The series' rating (e.g., out of 10).
 * @property {Array<object>} genres - An array of genre objects associated with the series.
 * @property {string} genres.name - The name of the genre. Required.
 * @property {number} numberOfSeasons - The total number of seasons. Required.
 * @property {string} status - The current status of the series ('Ongoing', 'Ended', 'Cancelled'). Required.
 * @property {object} trailer - Information about the series' trailer.
 * @property {string} trailer.url - URL to the trailer video.
 * @property {string} trailer.thumbnailURL - URL to the trailer's thumbnail image.
 */
const SeriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  referenceTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    name: String,
    bio: String,
    birthYear: Number,
    deathYear: Number,
  },
  actors: [String],
  imageURL: String,
  featured: Boolean,
  firstAirYear: Number,
  lastAirYear: Number,
  rating: Number,
  genres: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
  numberOfSeasons: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Ongoing", "Ended", "Cancelled"],
    required: true,
  },
  trailer: {
    url: String,
    thumbnailURL: String,
  },
});

module.exports = mongoose.model("Series", SeriesSchema);
