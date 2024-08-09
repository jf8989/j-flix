// Import required modules and configuration
const express = require("express");
const morgan = require("morgan");
const dbConfig = require("./config/db"); // MongoDB configuration
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");
const directorsRoutes = require("./routes/directors");

// Initialize Express application
const app = express();

// Middleware setup
app.use(morgan("common")); // Log HTTP requests
app.use(express.static("public")); // Serve static files from 'public' directory
app.use(express.json()); // Parse JSON bodies in requests

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
