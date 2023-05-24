const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    searchLocation: String,
    searchDistance: Number,
  },
  status: {
    type: String,
    default: "Pending",
    // "Pending", "Accepted", or "Declined"
  },
});

module.exports.Request = mongoose.model("Request", requestSchema);
