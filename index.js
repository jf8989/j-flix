// index.js
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

// Import and register models
require("./models/Movie");
require("./models/User");

const app = express();

// Middleware setup
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.json());
// Replace the simple cors() with this more specific configuration
let allowedOrigins = [
  "http://localhost:1234",
  "https://your-production-domain.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Add this line for CORS preflight
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

// Import routes
const moviesRoutes = require("./routes/movies");
const usersRoutes = require("./routes/users");
const directorsRoutes = require("./routes/directors");

// Add the root route here, before other route definitions
app.get("/", (req, res) => {
  res.send("Welcome to the Movie API");
});

// Define API routes
app.use("/movies", moviesRoutes);
app.use("/users", usersRoutes);
app.use("/directors", directorsRoutes);

// Error handling middleware
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
