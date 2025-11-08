const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Summary = require("../models/Summary");
const { summarizeVideo } = require("../utils/summarize");

// Create summary
router.post("/", authMiddleware, async (req, res) => {
  const { youtubeUrl, language } = req.body;
  try {
    const summaryText = await summarizeVideo(youtubeUrl, language);
    const summary = new Summary({ user: req.user._id, youtubeUrl, summaryText, language });
    await summary.save();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Failed to summarize video", error: error.message });
  }
});

// Get user history
router.get("/", authMiddleware, async (req, res) => {
  try {
    const history = await Summary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

module.exports = router;
