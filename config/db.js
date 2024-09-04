// config/db.js
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const uri = "mongodb://localhost:27017/myFlixDB";

async function connectDB() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri);
    console.log("Connected successfully to MongoDB using Mongoose");

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
