// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Represents a user in the database.
 * @typedef {object} UserSchema
 * @property {string} Username - The user's chosen username. Required, unique.
 * @property {string} Password - The user's hashed password. Required.
 * @property {string} Email - The user's email address. Required, unique.
 * @property {Date} Birthday - The user's date of birth.
 * @property {Array<mongoose.Schema.Types.ObjectId>} FavoriteMovies - An array of ObjectIds referencing favorite Movies.
 * @property {Array<mongoose.Schema.Types.ObjectId>} FavoriteSeries - An array of ObjectIds referencing favorite Series.
 */
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
  FavoriteSeries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Series" }],
});

// Static method to hash the password
/**
 * Hashes a plain text password using bcrypt.
 * @static
 * @function hashPassword
 * @memberof UserSchema
 * @param {string} password - The plain text password to hash.
 * @returns {string} The hashed password.
 */
UserSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10); // Ensure password and salt rounds (10) are provided
};

// Instance method to validate the password
/**
 * Validates a given plain text password against the user's stored hashed password.
 * @function validatePassword
 * @memberof UserSchema.methods
 * @param {string} password - The plain text password to validate.
 * @returns {boolean} True if the password matches, false otherwise.
 */
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
