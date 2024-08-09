// config/db.js

const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/myFlixDB";

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB using Mongoose");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

module.exports = { connectDB };
