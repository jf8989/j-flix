// index.js
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose"); // Add this line
const { connectDB } = require("./config/db");

// Import and register models
require("./models/Movie");
require("./models/User");

const app = express();
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.use(passport.initialize());

// Import routes after models are registered
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");
const directorsRoutes = require("./routes/directors");

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
