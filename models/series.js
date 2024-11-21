// models/Series.js
const mongoose = require("mongoose");

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
