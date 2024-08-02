// Import required modules
const express = require("express");
const morgan = require("morgan");
const os = require("os");

// Initialize Express application
const app = express();

// Middleware setup
app.use(morgan("common")); // Log HTTP requests
app.use(express.static("public")); // Serve static files from 'public' directory
app.use(express.json()); // Parse JSON bodies in requests

// Set the port for the server
const port = 8080;

// Define the movies array with full details
const movies = [
  {
    title: "Inception",
    director: "Christopher Nolan",
    genre: "Science Fiction",
    description:
      "A thief who enters the dreams of others to steal secrets from their subconscious.",
    imageUrl: "https://via.placeholder.com/300x450.png?text=Inception",
    featured: true,
    year: 2010,
  },
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    genre: "Drama",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    imageUrl:
      "https://via.placeholder.com/300x450.png?text=Shawshank+Redemption",
    featured: true,
    year: 1994,
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    genre: "Crime",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    imageUrl: "https://via.placeholder.com/300x450.png?text=The+Godfather",
    featured: true,
    year: 1972,
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    genre: "Crime",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    imageUrl: "https://via.placeholder.com/300x450.png?text=Pulp+Fiction",
    featured: false,
    year: 1994,
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    genre: "Action",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    imageUrl: "https://via.placeholder.com/300x450.png?text=The+Dark+Knight",
    featured: true,
    year: 2008,
  },
  {
    title: "Star Trek: Nemesis",
    director: "Stuart Baird",
    genre: "Science Fiction",
    description:
      "The Enterprise is diverted to the Romulan homeworld Romulus, supposedly because they want to negotiate a peace treaty.",
    imageUrl: "https://via.placeholder.com/300x450.png?text=Star+Trek:+Nemesis",
    featured: false,
    year: 2002,
  },
  {
    title: "Star Trek",
    director: "J.J. Abrams",
    genre: "Science Fiction",
    description:
      "The brash James T. Kirk tries to live up to his father's legacy with Mr. Spock keeping him in check as a vengeful Romulan from the future creates black holes to destroy the Federation one planet at a time.",
    imageUrl: "https://via.placeholder.com/300x450.png?text=Star+Trek",
    featured: true,
    year: 2009,
  },
  {
    title: "Star Trek Into Darkness",
    director: "J.J. Abrams",
    genre: "Science Fiction",
    description:
      "After the crew of the Enterprise find an unstoppable force of terror from within their own organization, Captain Kirk leads a manhunt to a war-zone world to capture a one-man weapon of mass destruction.",
    imageUrl:
      "https://via.placeholder.com/300x450.png?text=Star+Trek+Into+Darkness",
    featured: false,
    year: 2013,
  },
  {
    title: "Star Trek Beyond",
    director: "Justin Lin",
    genre: "Science Fiction",
    description:
      "The crew of the USS Enterprise explores the furthest reaches of uncharted space, where they encounter a new ruthless enemy, who puts them, and everything the Federation stands for, to the test.",
    imageUrl: "https://via.placeholder.com/300x450.png?text=Star+Trek+Beyond",
    featured: false,
    year: 2016,
  },
];

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interface = interfaces[interfaceName];
    for (const item of interface) {
      if (item.family === "IPv4" && !item.internal) {
        return item.address;
      }
    }
  }
  return "localhost";
}

// Route for the root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to j-Flix!");
});

// GET all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// GET movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find(
    (m) => m.title.toLowerCase() === title.toLowerCase()
  );

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});

// GET genre by name
app.get("/genres/:name", (req, res) => {
  const { name } = req.params;
  const movie = movies.find(
    (m) => m.genre.toLowerCase() === name.toLowerCase()
  );

  if (movie) {
    res.json({
      name: movie.genre,
      description: `Movies classified as ${movie.genre}`,
    });
  } else {
    res.status(404).send("Genre not found");
  }
});

// GET director by name
app.get("/directors/:name", (req, res) => {
  const { name } = req.params;
  const movie = movies.find(
    (m) => m.director.toLowerCase() === name.toLowerCase()
  );

  if (movie) {
    res.json({
      name: movie.director,
      bio: `${movie.director} is a renowned director known for ${movie.title}.`,
      birthYear: "Unknown", // add actual birth years to data
      deathYear: "N/A",
    });
  } else {
    res.status(404).send("Director not found");
  }
});

// POST new user registration
app.post("/users", (req, res) => {
  // Log the entire request body for debugging
  console.log("Request body:", req.body);

  // Log user details (excluding password)
  console.log("New user registration attempt:", {
    username: req.body.username || "Not provided",
    email: req.body.email || "Not provided",
    // Add any other non-sensitive fields you want to log
  });

  // Here we'd typically create a new user in the database
  // For now, we'll just send a success message
  res.status(201).json({
    message: `User ${req.body.username} registered successfully`,
  });
});

// PUT update user info
app.put("/users/:username", (req, res) => {
  // Log update attempt (excluding password)
  console.log("User info update attempt:", {
    username: req.params.username,
    newUsername: req.body.username,
    newEmail: req.body.email,
  });

  // Here we'd typically update the user's info in the database
  // For now, we'll just send a success message
  res.send(`User ${req.params.username}'s information updated successfully`);
});

// POST add movie to favorites
app.post("/users/:username/movies/:movieId", (req, res) => {
  // Log favorite addition
  console.log("Add to favorites attempt:", {
    username: req.params.username,
    movieId: req.params.movieId,
  });

  // Here we'd typically add the movie to the user's favorites in the database
  // For now, we'll just send a success message
  res
    .status(201)
    .send(
      `Movie ${req.params.movieId} has been added to ${req.params.username}'s favorites`
    );
});

// DELETE remove movie from favorites
app.delete("/users/:username/movies/:movieId", (req, res) => {
  // Log favorite removal
  console.log("Remove from favorites attempt:", {
    username: req.params.username,
    movieId: req.params.movieId,
  });

  // Here we'd typically remove the movie from the user's favorites in the database
  // For now, we'll just send a success message and log the removal
  console.log(
    `Movie ${req.params.movieId} has been removed from ${req.params.username}'s favorites`
  );
  res.send(
    `Movie ${req.params.movieId} has been removed from ${req.params.username}'s favorites`
  );
});

// DELETE deregister user
app.delete("/users/:username", (req, res) => {
  // Log deregistration attempt
  console.log("User deregistration attempt:", {
    username: req.params.username,
  });

  // Here we'd typically delete the user from the database
  // For now, we'll just send a success message
  res.send(`User ${req.params.username} has been deregistered`);
});

// Middleware for handling 404 errors (routes not found)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Something broke!");
});

// Get the local IP address
const localIpAddress = getLocalIpAddress();

// Start the server
app.listen(port, () => {
  console.log(`j-Flix server is running on port ${port}`);
  console.log(`Local:   http://localhost:${port}`);
  console.log(`Network: http://${localIpAddress}:${port}`);
});
