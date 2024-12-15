// seriesManager.js
/*
Purpose: Master script for managing TV series in the database
Usage Scenarios:
- When adding new TV series to your database
- When populating your database with a list of series
- When you need complete series information including trailers

Key Features:
- Creates and manages TV series entries
- Includes trailer information by default
- Handles multiple series from a list
- Includes detailed logging and error handling
*/
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

// Define the Series Schema (simplified)
const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  referenceTitle: String,
  description: String,
  creator: {
    name: String,
    bio: String,
    birth: String,
    death: String,
  },
  actors: [String],
  imageURL: String,
  featured: { type: Boolean, default: false },
  firstAirYear: Number,
  lastAirYear: Number,
  rating: Number,
  genres: [
    {
      name: String,
      description: String,
    },
  ],
  numberOfSeasons: Number,
  status: String,
  trailer: {
    site: { type: String },
    key: { type: String },
    name: { type: String },
    official: { type: Boolean },
    type: { type: String },
  },
});

const Series = mongoose.model("Series", seriesSchema);

class SeriesManager {
  constructor() {
    this.tmdbApiKey = process.env.TMDB_API_KEY;
    this.tmdbBaseUrl =
      process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
    this.tmdbImageBaseUrl =
      process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";
    this.genreMap = new Map();
  }

  async initialize() {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "myFlixDB",
      });
      console.log("Connected to MongoDB database:", mongoose.connection.name);

      // Clear existing series
      await Series.deleteMany({});
      console.log("Cleared existing series collection");

      await this.initializeGenreMap();
    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }
  }

  async initializeGenreMap() {
    const genreResponse = await axios.get(`${this.tmdbBaseUrl}/genre/tv/list`, {
      params: { api_key: this.tmdbApiKey },
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
    });

    this.genreMap = new Map(
      genreResponse.data.genres.map((genre) => [
        genre.id,
        {
          name: genre.name,
          description: `TV Series in the ${genre.name} genre`,
        },
      ])
    );
  }

  async findBestMatch(seriesTitle) {
    const searchResponse = await axios.get(`${this.tmdbBaseUrl}/search/tv`, {
      params: {
        api_key: this.tmdbApiKey,
        query: seriesTitle,
      },
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
    });

    const results = searchResponse.data.results;
    if (!results || results.length === 0) return null;

    return (
      results.find(
        (result) => result.name.toLowerCase() === seriesTitle.toLowerCase()
      ) || results[0]
    );
  }

  async getSeriesDetails(seriesId) {
    return axios.get(`${this.tmdbBaseUrl}/tv/${seriesId}`, {
      params: {
        api_key: this.tmdbApiKey,
        append_to_response: "credits,videos",
      },
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
    });
  }

  async processSeries(seriesTitle) {
    if (!seriesTitle) {
      throw new Error("Series title is required");
    }
    try {
      // Check if series already exists
      const existingSeries = await Series.findOne({
        $or: [
          { title: { $regex: new RegExp(`^${seriesTitle}$`, "i") } },
          { referenceTitle: { $regex: new RegExp(`^${seriesTitle}$`, "i") } },
        ],
      });

      if (existingSeries) {
        console.log(
          `Series "${seriesTitle}" already exists as "${existingSeries.title}". Skipping...`
        );
        return;
      }

      const bestMatch = await this.findBestMatch(seriesTitle);
      if (!bestMatch) {
        console.log(`No results found for "${seriesTitle}"`);
        return;
      }

      if (bestMatch.name.toLowerCase() !== seriesTitle.toLowerCase()) {
        console.log(
          `Matching "${seriesTitle}" to TMDB title "${bestMatch.name}"`
        );
      }

      const seriesDetails = await this.getSeriesDetails(bestMatch.id);
      const data = seriesDetails.data;

      // Process creator(s)
      const creator = data.created_by?.[0] || {
        name: "Unknown Creator",
        profile_path: null,
      };

      // Process genres
      const genres = data.genres.map((genre) => ({
        name: genre.name,
        description: `TV Series in the ${genre.name} genre`,
      }));

      // Process actors (limited to 4 main cast)
      const actors = data.credits.cast.slice(0, 4).map((actor) => actor.name);

      // Process trailer
      let trailer = null;
      if (data.videos && data.videos.results) {
        const officialTrailer = data.videos.results.find(
          (video) =>
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.official === true
        );

        const anyTrailer = data.videos.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        const firstVideo = data.videos.results.find(
          (video) => video.site === "YouTube"
        );

        const selectedVideo = officialTrailer || anyTrailer || firstVideo;

        if (selectedVideo) {
          trailer = {
            site: selectedVideo.site,
            key: selectedVideo.key,
            name: selectedVideo.name,
            official: selectedVideo.official || false,
            type: selectedVideo.type,
          };
        }
      }

      // Create new series document
      const newSeries = {
        title: data.name,
        referenceTitle: seriesTitle,
        description: data.overview,
        creator: {
          name: creator.name,
          bio: `Creator of ${data.name}`,
          birth: "Not available",
          death: "Not available",
        },
        actors: actors,
        imageURL: data.poster_path
          ? `${this.tmdbImageBaseUrl}${data.poster_path}`
          : null,
        featured: false,
        firstAirYear: new Date(data.first_air_date).getFullYear(),
        lastAirYear: data.in_production
          ? null
          : new Date(data.last_air_date).getFullYear(),
        rating: data.vote_average,
        genres: genres,
        numberOfSeasons: data.number_of_seasons,
        status: data.status,
        trailer: trailer,
      };

      // Save to database
      await Series.create(newSeries);
      console.log(`Successfully added "${seriesTitle}" to database`);
      console.log(`Genres: ${genres.map((g) => g.name).join(", ")}`);
      console.log(`Creator: ${newSeries.creator?.name}`);
      console.log(`First Air Year: ${newSeries.firstAirYear}`);
      console.log(`Number of Seasons: ${newSeries.numberOfSeasons}`);
      console.log("-".repeat(50));
    } catch (error) {
      console.error(`Error processing "${seriesTitle}":`, error.message);
    }
  }

  async processSeriesList(seriesList) {
    console.log(`Starting to process ${seriesList.length} series...`);
    let successCount = 0;
    let errorCount = 0;

    for (const [index, seriesTitle] of seriesList.entries()) {
      console.log(
        `\nProcessing ${index + 1}/${seriesList.length}: "${seriesTitle}"`
      );
      try {
        await this.processSeries(seriesTitle);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to process "${seriesTitle}":`, error.message);
      }
      // Rate limit delay
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased delay to 1 second
    }

    console.log("\nProcessing Summary:");
    console.log(`Total series attempted: ${seriesList.length}`);
    console.log(`Successfully processed: ${successCount}`);
    console.log(`Failed to process: ${errorCount}`);
  }

  async cleanup() {
    await mongoose.disconnect();
    console.log("Finished processing series and closed database connection");
  }
}

// Export the class for use in other scripts
module.exports = SeriesManager;

// If running directly, process the series list
if (require.main === module) {
  const seriesList = [
    "Breaking Bad",
    "The Crown",
    "Stranger Things",
    "The Mandalorian",
    "Game of Thrones",
    "Friends",
    "The Office",
    "Chernobyl",
    "Band of Brothers",
    "The Pacific",
    "The Wire",
    "Fargo",
    "True Detective",
    "Westworld",
    "Black Mirror",
    "The Twilight Zone",
    "The X-Files",
    "Lost",
    "24",
    "Homeland",
    "House of Cards",
    "The Americans",
    "Mad Men",
    "Better Call Saul",
    "Narcos",
    "Peaky Blinders",
    "Boardwalk Empire",
    "Rome",
    "Deadwood",
    "The Sopranos",
  ];

  const manager = new SeriesManager();
  manager
    .initialize()
    .then(() => manager.processSeriesList(seriesList))
    .then(() => manager.cleanup())
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}
