const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  youtubeUrl: { type: String, required: true },
  summaryText: { type: String, required: true },
  language: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Summary", summarySchema);
