// index.js

const express = require("express");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");
const directorsRoutes = require("./routes/directors");

// Import Mongoose models
require("./models/Movie");
require("./models/User");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Define API routes
app.use("/movies", moviesRoutes);
app.use("/users", usersRoutes);
app.use("/directors", directorsRoutes);

// Set the port for the server
const port = 8080;
app.listen(port, () => {
  console.log(`j-Flix server is running on port ${port}`);
});
