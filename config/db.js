// config/db.js
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

// Use the correct MongoDB URI based on the environment
const uri =
  process.env.NODE_ENV === "development"
    ? "mongodb://localhost:27017/myFlixDB" // Local DB for development
    : process.env.MONGODB_URI; // MongoDB Atlas for production


/**
* Asynchronously connects to the MongoDB database using Mongoose.
* Selects the appropriate database URI based on the NODE_ENV environment variable.
* Logs connection status and handles connection errors.
* Optionally drops the 'users' collection in development mode.
* @async
* @function connectDB
* @throws {Error} If the database connection fails.
*/
async function connectDB() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri, {
      dbName: "myFlixDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Connected successfully to MongoDB using Mongoose (${process.env.NODE_ENV})`
    );

    console.log(`Connecting to MongoDB URI: ${uri}`);

    // Only drop the users collection in development mode
    if (process.env.NODE_ENV === "development") {
      await dropUsersCollection();
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if connection fails
  }
}

async function dropUsersCollection() {
  try {
    await mongoose.connection.collection("users").drop();
    console.log("Users collection dropped successfully");
  } catch (err) {
    if (err.code === 26) {
      console.log("Users collection doesn't exist, skipping drop");
    } else {
      console.error("Error dropping users collection:", err);
    }
  }
}

module.exports = { connectDB };
