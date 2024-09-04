// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// Static method to hash the password
UserSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10); // Ensure password and salt rounds (10) are provided
};

// Instance method to validate the password
UserSchema.methods.validatePassword = function (password) {
  // Log the hashed password from the database
  console.log("Hashed password from DB:", this.Password);

  // Log the password provided during login
  console.log("Password provided for comparison:", password);

  // Compare the provided password with the hashed password
  const isMatch = bcrypt.compareSync(password, this.Password);

  if (isMatch) {
    console.log("Passwords match!");
  } else {
    console.log("Passwords do NOT match!");
  }

  return isMatch; // Return true if passwords match, false otherwise
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
