const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  username: { type: String, required: true },
  token: String,
  hash: String,
  salt: String,
  charactersFavorites: [],
  comicsFavorites: [],
});

module.exports = User;
