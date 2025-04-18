// index.js
/**
 * Main application file for the j-Flix API.
 * Sets up Express server, middleware (Morgan, CORS, JSON parsing, static files),
 * connects to MongoDB, initializes Passport for authentication, defines routes,
 * and starts the server.
 * @module index
 */
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

// Import and register models
require("./models/Movie");
require("./models/User");
require("./models/Series");

const app = express();

// Middleware setup
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Enable pre-flight across-the-board
app.options("*", cors());

// Passport setup
const passport = require("passport");
require("./passport");
app.use(passport.initialize());

// Load auth
let auth = require("./auth")(app);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path, req.headers.origin);
  next();
});

// Import routes
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");
const directorsRoutes = require("./routes/directors");
const seriesRoutes = require("./routes/series");

// Add the root route here, before other route definitions
/**
 * Serves a welcome message for the root endpoint.
 * @name GET /
 * @function
 * @memberof module:index
 * @param {string} path - Express path.
 * @param {callback} middleware - Route handler.
 */
app.get("/", (req, res) => {
  res.send("Welcome to the Movie API");
});

// Define API routes
app.use("/movies", moviesRoutes);
app.use("/users", usersRoutes);
app.use("/directors", directorsRoutes);
app.use("/series", seriesRoutes);

// Error handling middleware
/**
 * Global error handling middleware.
 * Logs the error stack trace and sends a generic 500 response.
 * @function ErrorHandler
 * @memberof module:index
 * @param {Error} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Set the port and start the server
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`j-Flix server is running on port ${port}`);
});

module.exports = app;
