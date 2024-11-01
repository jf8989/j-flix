// utils/tmdb.js
const axios = require("axios");

class TMDBService {
  constructor() {
    this.client = axios.create({
      baseURL: "https://api.themoviedb.org/3",
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  }

  async searchMovie(title, year) {
    try {
      const response = await this.client.get("/search/movie", {
        params: {
          query: title,
          year: year, // Optional but helps accuracy
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        const movie = response.data.results[0];
        return {
          imageURL: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          tmdbId: movie.id,
          year: new Date(movie.release_date).getFullYear(),
        };
      }
      return null;
    } catch (error) {
      console.error(`TMDB search error for ${title}:`, error.message);
      return null;
    }
  }
}

module.exports = new TMDBService();
