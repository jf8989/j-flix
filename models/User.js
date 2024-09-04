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
  return bcrypt.compareSync(password, this.Password); // Compare the plain password to the hashed password
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
