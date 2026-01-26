const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: true,
  },
  resumeText: {
    type: String, 
    required: true, 
  },
  matchScore: {
    type: Number,
    required: true,
  },
  matchedSkills: [String],
  missingSkills: [String],
  aiSuggestions: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Match", MatchSchema);