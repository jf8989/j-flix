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

UserSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

module.exports = mongoose.model("User", UserSchema);
