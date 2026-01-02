const express = require("express");
const upload = require("../middleware/upload");
const { extractText } = require("../services/parser.service");
const { extractSkills, generateSuggestions } = require("../services/openai.service");
const { calculateScore } = require("../services/score.service");

const router = express.Router();

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    console.log("--- New Match Request Received ---");

    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ error: "Resume file is required" });
    }

    if (!req.body.jobDescription) {
      console.error("❌ No job description provided");
      return res.status(400).json({ error: "Job description is required" });
    }

    const resumeText = await extractText(req.file);
    const jobDescription = req.body.jobDescription;

    console.log("📄 Resume Text Length:", resumeText.length);
    if (resumeText.length === 0) {
      throw new Error("Could not extract any text from the PDF. Is it a scanned image?");
    }

    console.log(" Extracting skills via AI...");
    const resumeSkills = await extractSkills(resumeText);
    const jobSkills = await extractSkills(jobDescription);

    console.log("✅ Resume Skills Found:", resumeSkills);
    console.log("✅ Job Skills Found:", jobSkills);

    const result = calculateScore(resumeSkills, jobSkills);

    const suggestions = await generateSuggestions(result.missingSkills);

    console.log("📊 Final Score:", result.score);
    res.json({
      matchScore: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      suggestions
    });

  } catch (err) {
    console.error("===== MATCH ROUTE ERROR =====");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("============================");

    return res.status(500).json({
      error: err.message || "Failed to analyze resume"
    });
  }
});

module.exports = router;
