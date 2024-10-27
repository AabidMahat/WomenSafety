const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fcm_token: {
    type: String,
  },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
