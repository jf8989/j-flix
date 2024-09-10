// index.js
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
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

// **MongoDB connection** (using MONGODB_URI from environment variables)
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

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

// Set the port for the server, using Vercel's or local development port
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`j-Flix server is running on port ${port}`);
});

module.exports = app; // Export the app to be used by Vercel
