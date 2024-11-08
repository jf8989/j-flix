const axios = require("axios");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
require("dotenv").config();

const tmdbApiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

// Diverse list of 20 movies from various genres
const moviesToAdd = [
  // Fantasy
  "The Lord of the Rings: The Fellowship of the Ring",
  "Harry Potter and the Sorcerer's Stone",
  "Pan's Labyrinth",
  "Pirates of the Caribbean: The Curse of the Black Pearl",
  "The Princess Bride",
  "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
  "Stardust",
  "The Hobbit: An Unexpected Journey",
  "Alice in Wonderland (2010)",
  "Maleficent",
  "Harry Potter and the Chamber of Secrets",
  "The Lord of the Rings: The Return of the King",
  "The Golden Compass",
  "Eragon",
  "The Shape of Water",
  "The Secret of Kells",
  "The NeverEnding Story",
  "Willow",
  "Coraline",

  // Family
  "The Lion King",
  "Toy Story",
  "Finding Nemo",
  "Coco",
  "Matilda",
  "The Sound of Music",
  "Mary Poppins",
  "Home Alone",
  "Jumanji (1995)",
  "The Incredibles",
  "Enchanted",
  "Paddington",
  "Shrek",
  "Frozen",
  "Moana",
  "The Wizard of Oz",
  "The Parent Trap (1998)",
  "Despicable Me",
  "How to Train Your Dragon",
  "The Jungle Book (2016)",
  "Charlotte's Web",
  "A Bug's Life",
  "Zootopia",
  "The Iron Giant",

  // Mystery
  "Knives Out",
  "Gone Girl",
  "The Girl with the Dragon Tattoo",
  "Murder on the Orient Express (2017)",
  "Prisoners",
  "Shutter Island",
  "Zodiac",
  "The Sixth Sense",
  "Se7en",
  "Mystic River",
  "The Prestige",
  "Arrival (2016)",
  "The Da Vinci Code",
  "The Others",
  "The Game",
  "The Illusionist",
  "Memento",
  "The Girl on the Train",
  "Tinker Tailor Soldier Spy",
  "L.A. Confidential",
  "The Usual Suspects",
  "The Machinist",

  // Sci-Fi
  "Inception",
  "The Matrix",
  "Interstellar",
  "Blade Runner 2049",
  "Dune",
  "The Fifth Element",
  "Minority Report",
  "Edge of Tomorrow",
  "E.T. the Extra-Terrestrial",
  "Contact",
  "The Terminator",
  "Avatar",
  "A.I. Artificial Intelligence",
  "Jurassic Park",
  "The War of the Worlds (2005)",
  "Total Recall (1990)",
  "The Martian",
  "Star Wars: A New Hope",
  "Rogue One: A Star Wars Story",
  "Guardians of the Galaxy",
  "Looper",
  "Children of Men",
  "The Andromeda Strain",
  "Ex Machina",
  "Oblivion",

  // War
  "Saving Private Ryan",
  "Dunkirk",
  "1917",
  "Hacksaw Ridge",
  "The Thin Red Line",
  "Black Hawk Down",
  "Apocalypse Now",
  "Full Metal Jacket",
  "Platoon",
  "The Hurt Locker",
  "Schindler's List",
  "Inglourious Basterds",
  "Fury",
  "Letters from Iwo Jima",
  "The Pianist",
  "Patton",
  "Braveheart",
  "Enemy at the Gates",
  "A Bridge Too Far",
  "Tora! Tora! Tora!",
  "Midway (2019)",
  "We Were Soldiers",
  "The Bridge on the River Kwai",
  "The Great Escape",
];

async function addMoviesToCollection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch TMDB genre list
    const genreResponse = await axios.get(`${tmdbBaseUrl}/genre/movie/list`, {
      params: { api_key: tmdbApiKey },
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });

    const genreMap = new Map(
      genreResponse.data.genres.map((genre) => [
        genre.id,
        {
          name: genre.name,
          description: `Movies in the ${genre.name} genre`,
        },
      ])
    );

    for (const movieTitle of moviesToAdd) {
      try {
        // Check for existing movie
        const existingMovie = await Movie.findOne({
          title: { $regex: new RegExp(`^${movieTitle}$`, "i") },
        });

        if (existingMovie) {
          console.log(
            `Movie "${movieTitle}" already exists in database. Skipping...`
          );
          continue;
        }

        // Search TMDB
        const searchResponse = await axios.get(`${tmdbBaseUrl}/search/movie`, {
          params: {
            api_key: tmdbApiKey,
            query: movieTitle,
          },
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          },
        });

        const results = searchResponse.data.results;

        if (results && results.length > 0) {
          const bestMatch =
            results.find(
              (result) =>
                result.title.toLowerCase() === movieTitle.toLowerCase()
            ) || results[0];

          // Get detailed movie info with credits
          const movieDetails = await axios.get(
            `${tmdbBaseUrl}/movie/${bestMatch.id}`,
            {
              params: {
                api_key: tmdbApiKey,
                append_to_response: "credits",
              },
              headers: {
                Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
              },
            }
          );

          // Get director
          const director = movieDetails.data.credits.crew.find(
            (person) => person.job.toLowerCase() === "director"
          );

          // Get actors (limited to 4)
          const actors = movieDetails.data.credits.cast
            .slice(0, 4)
            .map((actor) => actor.name);

          // Create new movie document matching schema
          const newMovie = {
            title: movieDetails.data.title,
            description: movieDetails.data.overview,
            genre: genreMap.get(movieDetails.data.genres[0]?.id) || {
              name: "Unknown",
              description: "Genre information not available",
            },
            director: director
              ? {
                  name: director.name,
                  bio: `Director of ${movieDetails.data.title}`,
                  birth: "Not available",
                  death: "Not available",
                }
              : null,
            imageURL: movieDetails.data.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieDetails.data.poster_path}`
              : null,
            featured: false,
            actors: actors,
            rating: movieDetails.data.vote_average,
            releaseYear: new Date(movieDetails.data.release_date).getFullYear(),
          };

          // Save to database
          await Movie.create(newMovie);
          console.log(`Successfully added "${movieTitle}" to database`);
          console.log(`Genre: ${newMovie.genre.name}`);
          console.log(`Director: ${newMovie.director.name}`);
          console.log(`Release Year: ${newMovie.releaseYear}`);
          console.log("-".repeat(50));
        } else {
          console.log(`No results found for "${movieTitle}"`);
        }

        // Rate limit delay
        await new Promise((resolve) => setTimeout(resolve, 250));
      } catch (error) {
        console.error(`Error adding "${movieTitle}":`, error.message);
      }
    }

    await mongoose.disconnect();
    console.log("Finished adding movies to collection");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

addMoviesToCollection();
