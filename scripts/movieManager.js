// movieManager.js
/*
Purpose: Master script for adding new movies to the database with complete information
Usage Scenarios:
- When adding new movies to your database from scratch
- When you want to populate your database with a list of movies
- When you need to ensure new movies have all required fields including trailers

Key Features:
- Adds complete movie information including trailers
- Handles genre mapping
- Processes multiple movies from a list
- Includes robust error handling and rate limiting
*/
const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
require("dotenv").config({ path: "../.env" });

class MovieManager {
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
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "myFlixDB",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB database:", mongoose.connection.name);

      // Initialize genre map from TMDB
      await this.initializeGenreMap();
    } catch (error) {
      console.error("Initialization error:", error);
      throw error;
    }
  }

  async initializeGenreMap() {
    const genreResponse = await axios.get(
      `${this.tmdbBaseUrl}/genre/movie/list`,
      {
        params: { api_key: this.tmdbApiKey },
        headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
      }
    );

    this.genreMap = new Map(
      genreResponse.data.genres.map((genre) => [
        genre.id,
        { name: genre.name, description: `Movies in the ${genre.name} genre` },
      ])
    );
  }

  async findBestMatch(movieTitle, releaseYear = null) {
    const searchResponse = await axios.get(`${this.tmdbBaseUrl}/search/movie`, {
      params: {
        api_key: this.tmdbApiKey,
        query: movieTitle,
        year: releaseYear,
      },
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
    });

    const results = searchResponse.data.results;
    if (!results || results.length === 0) return null;

    return (
      results.find(
        (result) =>
          result.title.toLowerCase() === movieTitle.toLowerCase() &&
          (!releaseYear ||
            new Date(result.release_date).getFullYear() === releaseYear)
      ) || results[0]
    );
  }

  async getMovieDetails(movieId) {
    return axios.get(`${this.tmdbBaseUrl}/movie/${movieId}`, {
      params: {
        api_key: this.tmdbApiKey,
        append_to_response: "credits,videos", // Added videos to the request
      },
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
    });
  }

  async processMovie(movieTitle) {
    try {
      // First, check if movie exists using our reference title
      const existingMovie = await Movie.findOne({
        $or: [
          { title: { $regex: new RegExp(`^${movieTitle}$`, "i") } },
          { referenceTitle: { $regex: new RegExp(`^${movieTitle}$`, "i") } },
        ],
      });

      if (existingMovie) {
        console.log(
          `Movie "${movieTitle}" already exists as "${existingMovie.title}". Skipping...`
        );
        return;
      }

      const bestMatch = await this.findBestMatch(movieTitle);
      if (!bestMatch) {
        console.log(`No results found for "${movieTitle}"`);
        return;
      }

      // Log the title matching for verification
      if (bestMatch.title.toLowerCase() !== movieTitle.toLowerCase()) {
        console.log(
          `Matching "${movieTitle}" to TMDB title "${bestMatch.title}"`
        );
      }

      const movieDetails = await this.getMovieDetails(bestMatch.id);
      const data = movieDetails.data;

      // Process director
      const director = data.credits.crew.find(
        (person) => person.job.toLowerCase() === "director"
      );

      // Process genres
      const genres = data.genres.map((genre) => ({
        name: genre.name,
        description: `Movies in the ${genre.name} genre`,
      }));

      // Process actors (limited to 4)
      const actors = data.credits.cast.slice(0, 4).map((actor) => actor.name);

      // Process trailer
      let trailer = null;
      if (data.videos && data.videos.results) {
        // Look for official trailers first
        const officialTrailer = data.videos.results.find(
          (video) =>
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.official === true
        );

        // If no official trailer, look for any trailer
        const anyTrailer = data.videos.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        // Use the first video if no trailers found
        const firstVideo = data.videos.results.find(
          (video) => video.site === "YouTube"
        );

        // Select the best available video
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

      // Create new movie document
      const newMovie = {
        title: data.title, // TMDB's official title
        referenceTitle: movieTitle, // Our original reference title
        description: data.overview,
        director: director
          ? {
              name: director.name,
              bio: `Director of ${data.title}`,
              birth: "Not available",
              death: "Not available",
            }
          : null,
        actors: actors,
        imageURL: data.poster_path
          ? `${this.tmdbImageBaseUrl}${data.poster_path}`
          : null,
        featured: false,
        releaseYear: new Date(data.release_date).getFullYear(),
        rating: data.vote_average,
        genres: genres,
        tmdbId: data.id, // Store TMDB ID for future reference
        trailer: trailer, // Add trailer information
      };

      // Save to database
      await Movie.create(newMovie);
      console.log(`Successfully added "${movieTitle}" to database`);
      console.log(`Genres: ${genres.map((g) => g.name).join(", ")}`);
      console.log(`Director: ${newMovie.director?.name}`);
      console.log(`Release Year: ${newMovie.releaseYear}`);
      console.log("-".repeat(50));
    } catch (error) {
      console.error(`Error processing "${movieTitle}":`, error.message);
    }
  }

  async processMovieList(movieList) {
    for (const movieTitle of movieList) {
      await this.processMovie(movieTitle);
      // Rate limit delay
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  async cleanup() {
    await mongoose.disconnect();
    console.log("Finished processing movies and closed database connection");
  }
}

// Export the class for use in other scripts
module.exports = MovieManager;

// If running directly, process the movie list
if (require.main === module) {
  const movieList = [
    "Saving Private Ryan",
    "Apocalypse Now",
    "Schindler's List",
    "Platoon",
    "The Hurt Locker",
    "Hacksaw Ridge",
    "Letters from Iwo Jima",
    "Midway",
    "Black Hawk Down",
    "The Thin Red Line",
    "Inglourious Basterds",
    "1917",
    "Full Metal Jacket",
    "Dunkirk",
    "Fury",
    "Tora! Tora! Tora!",
    "We Were Soldiers",
    "Enemy at the Gates",
    "Braveheart",
    "A Bridge Too Far",
    "Patton",
    "The Bridge on the River Kwai",
    "Glory",
    "The Great Escape",
    "The Girl with the Dragon Tattoo",
    "Knives Out",
    "Gone Girl",
    "The Sixth Sense",
    "Shutter Island",
    "Zodiac",
    "The Others",
    "The Prestige",
    "Mystic River",
    "Seven",
    "Prisoners",
    "Memento",
    "The Illusionist",
    "The Usual Suspects",
    "The Machinist",
    "Sherlock Holmes",
    "Sherlock Holmes: A Game of Shadows",
    "The Girl on the Train",
    "Tinker Tailor Soldier Spy",
    "Get Out",
    "Pride & Prejudice",
    "Titanic",
    "The Notebook",
    "Casablanca",
    "La La Land",
    "10 Things I Hate About You",
    "Notting Hill",
    "Pretty Woman",
    "A Walk to Remember",
    "Sleepless in Seattle",
    "You've Got Mail",
    "Love Actually",
    "Crazy, Stupid, Love",
    "The Fault in Our Stars",
    "Me Before You",
    "Bridget Jones's Diary",
    "When Harry Met Sally",
    "Ever After",
    "Sweet Home Alabama",
    "Dirty Dancing",
    "To All the Boys I've Loved Before",
    "The Princess Diaries",
    "The Last Song",
    "Silver Linings Playbook",
    "Amadeus",
    "Schindler's List",
    "Lincoln",
    "Braveheart",
    "The King's Speech",
    "12 Years a Slave",
    "Darkest Hour",
    "The Imitation Game",
    "The Pianist",
    "Gangs of New York",
    "Lawrence of Arabia",
    "Apollo 13",
    "A Beautiful Mind",
    "The Theory of Everything",
    "Hidden Figures",
    "Dunkirk",
    "The Patriot",
    "Elizabeth",
    "Gandhi",
    "Munich",
    "Glory",
    "Defiance",
    "42",
    "The Post",
  ];

  const manager = new MovieManager();
  manager
    .initialize()
    .then(() => manager.processMovieList(movieList))
    .then(() => manager.cleanup())
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}
