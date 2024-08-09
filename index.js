// Import required modules
const express = require("express");
const morgan = require("morgan");
const { MongoClient, ObjectId } = require("mongodb");

// Initialize Express application
const app = express();

// Middleware setup
app.use(morgan("common")); // Log HTTP requests
app.use(express.static("public")); // Serve static files from 'public' directory
app.use(express.json()); // Parse JSON bodies in requests

// Set the port for the server
const port = 8080;

// MongoDB setup
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
client
  .connect()
  .then(() => {
    console.log("Connected successfully to MongoDB");
    db = client.db("myFlixDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Route for the root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to j-Flix!");
});

// GET all movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await db.collection("movies").find().toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// GET movie by title
app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await db
      .collection("movies")
      .findOne({ title: req.params.title });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// GET genre by name
app.get("/genres/:name", async (req, res) => {
  try {
    const movie = await db
      .collection("movies")
      .findOne({ "genre.name": req.params.name });
    if (movie) {
      res.json(movie.genre);
    } else {
      res.status(404).send("Genre not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// GET director by name
app.get("/directors/:name", async (req, res) => {
  try {
    const movie = await db
      .collection("movies")
      .findOne({ "director.name": req.params.name });
    if (movie) {
      res.json(movie.director);
    } else {
      res.status(404).send("Director not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// POST new user registration
app.post("/users", async (req, res) => {
  try {
    const newUser = req.body;
    const result = await db.collection("users").insertOne(newUser);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// PUT update user info
app.put("/users/:username", async (req, res) => {
  try {
    const updatedUser = req.body;
    const result = await db
      .collection("users")
      .updateOne({ username: req.params.username }, { $set: updatedUser });
    if (result.modifiedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.json({ message: "User updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// POST add movie to favorites
app.post("/users/:username/movies/:movieId", async (req, res) => {
  try {
    const result = await db
      .collection("users")
      .updateOne(
        { username: req.params.username },
        { $addToSet: { favoriteMovies: new ObjectId(req.params.movieId) } }
      );
    if (result.modifiedCount === 0) {
      res.status(404).send("User not found or movie already in favorites");
    } else {
      res.status(200).send("Movie added to favorites");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// DELETE remove movie from favorites
app.delete("/users/:username/movies/:movieId", async (req, res) => {
  try {
    const result = await db
      .collection("users")
      .updateOne(
        { username: req.params.username },
        { $pull: { favoriteMovies: new ObjectId(req.params.movieId) } }
      );
    if (result.modifiedCount === 0) {
      res.status(404).send("User not found or movie not in favorites");
    } else {
      res.status(200).send("Movie removed from favorites");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// READ query 1: Read all movies that match a certain name
app.get("/movies/name/:name", async (req, res) => {
  try {
    const movies = await db
      .collection("movies")
      .find({ title: { $regex: req.params.name, $options: "i" } })
      .toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// READ query 2: Read all movies with a certain genre
app.get("/movies/genre/:genreName", async (req, res) => {
  try {
    const movies = await db
      .collection("movies")
      .find({ "genre.name": req.params.genreName })
      .toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// READ query 3: Read all movies with a certain genre AND a certain director
app.get("/movies/genre/:genreName/director/:directorName", async (req, res) => {
  try {
    const movies = await db
      .collection("movies")
      .find({
        "genre.name": req.params.genreName,
        "director.name": req.params.directorName,
      })
      .toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// UPDATE query 1: Update the description of a particular movie
app.put("/movies/:title/description", async (req, res) => {
  try {
    const result = await db
      .collection("movies")
      .updateOne(
        { title: { $regex: new RegExp(`^${req.params.title}$`, "i") } },
        { $set: { description: req.body.description } }
      );

    if (result.matchedCount === 0) {
      res.status(404).send("Movie not found");
    } else if (result.modifiedCount === 0) {
      res.status(200).send("No changes were made to the movie description");
    } else {
      res
        .status(200)
        .json({ message: "Movie description updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// UPDATE query 2: Update the bio of a certain director of multiple movies
app.put("/directors/:name/bio", async (req, res) => {
  try {
    const result = await db
      .collection("movies")
      .updateMany(
        {
          "director.name": { $regex: new RegExp(`^${req.params.name}$`, "i") },
        },
        { $set: { "director.bio": req.body.bio } }
      );

    if (result.matchedCount === 0) {
      res.status(404).send("Director not found");
    } else if (result.modifiedCount === 0) {
      res.status(200).send("No changes were made to the director's bio");
    } else {
      res
        .status(200)
        .json({ message: `Updated bio for ${result.modifiedCount} movies` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// UPDATE query 3: Add a certain movie to a particular user's list of favorites
app.post("/users/:username/favorites/:movieTitle", async (req, res) => {
  try {
    const movie = await db.collection("movies").findOne({
      title: { $regex: new RegExp(`^${req.params.movieTitle}$`, "i") },
    });

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    const result = await db
      .collection("users")
      .updateOne(
        { username: { $regex: new RegExp(`^${req.params.username}$`, "i") } },
        { $addToSet: { favoriteMovies: movie._id } }
      );

    if (result.matchedCount === 0) {
      res.status(404).send("User not found");
    } else if (result.modifiedCount === 0) {
      res.status(200).send("Movie is already in user's favorites");
    } else {
      res
        .status(200)
        .json({ message: "Movie added to favorites successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// DELETE query: Delete a certain user by username
app.delete("/users/:username", async (req, res) => {
  try {
    const result = await db
      .collection("users")
      .deleteOne({ username: req.params.username });
    if (result.deletedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.json({ message: "User deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// GET movies by actor
app.get('/movies/actor/:actorName', async (req, res) => {
  try {
    const movies = await db.collection('movies').find({ actors: req.params.actorName }).toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// GET movies by release year
app.get('/movies/year/:year', async (req, res) => {
  try {
    const movies = await db.collection('movies').find({ releaseYear: parseInt(req.params.year) }).toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// GET movies by minimum rating
app.get('/movies/rating/:minRating', async (req, res) => {
  try {
    const movies = await db.collection('movies').find({ rating: { $gte: parseFloat(req.params.minRating) } }).toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// GET all movies by a director
app.get('/directors/:directorName/movies', async (req, res) => {
  try {
    const movies = await db.collection('movies').find({ 'director.name': req.params.directorName }).toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// UPDATE to add a movie to a director's filmography
app.put('/directors/:directorName/movies/:movieId', async (req, res) => {
  try {
    const result = await db.collection('directors').updateOne(
      { name: req.params.directorName },
      { $addToSet: { movies: new ObjectId(req.params.movieId) } }
    );
    if (result.modifiedCount === 0) {
      res.status(404).send('Director not found or movie already in filmography');
    } else {
      res.json({ message: 'Movie added to director\'s filmography successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
  console.log(`j-Flix server is running on port ${port}`);
});
