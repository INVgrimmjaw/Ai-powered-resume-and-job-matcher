const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");

const connectDB = require("./config/db");
const upload = require("./middleware/upload");
const Match = require("./models/Match");
const { extractText } = require("./services/parser.service");
const { extractSkills, generateSuggestions } = require("./services/openai.service");
const { calculateScore } = require("./services/score.service");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/match", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    if (!req.body.jobDescription || req.body.jobDescription.trim().length < 50) {
      return res.status(400).json({ error: "Job description is too short" });
    }

    const resumeText = await extractText(req.file);

    if (!resumeText || resumeText.length === 0) {
      return res.status(400).json({ error: "Could not extract text from resume" });
    }

    const [resumeSkills, jobSkills] = await Promise.all([
      extractSkills(resumeText),
      extractSkills(req.body.jobDescription)
    ]);

    const result = calculateScore(resumeSkills, jobSkills);

    let topMissingSkills = result.missingSkills;

    if (result.missingSkills.length > 5) {
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY
      });

      const vectorStore = await MemoryVectorStore.fromTexts(
        result.missingSkills,
        result.missingSkills.map((_, i) => ({ id: i })),
        embeddings
      );

      const searchResults = await vectorStore.similaritySearch(req.body.jobDescription, 5);
      topMissingSkills = searchResults.map(doc => doc.pageContent);
    }

    const suggestions = await generateSuggestions(topMissingSkills);

    const newMatch = await Match.create({
      jobDescription: req.body.jobDescription,
      resumeText: resumeText,
      matchScore: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      aiSuggestions: suggestions
    });

    res.json({
      _id: newMatch._id,
      matchScore: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      suggestions
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message || "Failed to analyze resume"
    });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const history = await Match.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});