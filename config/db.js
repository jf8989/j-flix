// Import MongoClient from MongoDB package
const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = "mongodb://localhost:27017";

// Create a new MongoClient instance
const client = new MongoClient(uri);

// Database object
let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db("myFlixDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Function to get the database instance
function getDB() {
  return db;
}

// Export connectDB and getDB functions
module.exports = { connectDB, getDB };
