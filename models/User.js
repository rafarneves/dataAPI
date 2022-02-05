const mongoose = require("mongoose");

const User = mongoose.model("User", {
  nome: String,
  email: String,
  telefone: Number,
});

module.exports = User;
