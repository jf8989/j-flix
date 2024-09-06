// index.js
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const cors = require("cors"); // Import CORS package

// Import and register models
require("./models/Movie");
require("./models/User");

const app = express();

// **Middleware setup BEFORE routes**
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.json()); // **Place this before authentication and routes**
app.use(cors()); // **Enable CORS for all domains - Step 1**

// **Passport setup AFTER middleware**
const passport = require("passport");
require("./passport"); // Load passport strategies
app.use(passport.initialize());

// Load auth after passport setup and middleware
let auth = require("./auth")(app); // Use app to define routes in auth.js

// Connect to MongoDB after middleware is set up
connectDB();

// Import routes after models are registered
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");
const directorsRoutes = require("./routes/directors");

// **Define API routes AFTER middleware and Passport are initialized**
app.use("/movies", moviesRoutes);
app.use("/users", usersRoutes);
app.use("/directors", directorsRoutes);

// **Error handling middleware - LAST**
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Set the port for the server
const port = 8080;
app.listen(port, () => {
  console.log(`j-Flix server is running on port ${port}`);
});
