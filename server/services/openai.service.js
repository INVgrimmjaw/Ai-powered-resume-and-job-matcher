const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function extractSkills(text) {
  // If text is empty or too short, don't call AI
  if (!text || text.trim().length < 10) {
    console.log("⚠️ Warning: Text too short for extraction");
    return [];
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an expert HR assistant. Extract a comprehensive list of technical and soft skills from the provided text. Return a JSON object with a key 'skills' containing an array of strings. Example: {\"skills\": [\"javascript\", \"project management\"]}"
        },
        {
          role: "user",
          content: `Extract all skills from this text: ${text}`
        }
      ]
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    const skills = parsed.skills || [];
    
    // Normalize: lowercase, trimmed, and removed duplicates
    const finalSkills = [...new Set(skills.map(s => s.toLowerCase().trim()))];
    console.log("✅ Extracted Skills:", finalSkills);
    return finalSkills;
  } catch (err) {
    console.error("❌ OpenAI Skill Extraction Error:", err.message);
    return [];
  }
}

async function generateSuggestions(missingSkills) {
  if (!missingSkills || missingSkills.length === 0) {
    return "Your resume already matches the job requirements well.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: "You are a professional career coach. Provide 3 specific, bulleted suggestions on how the candidate can highlight missing skills or gain them."
        },
        {
          role: "user",
          content: `The candidate is missing these skills for a job: ${missingSkills.join(", ")}`
        }
      ]
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    return "Focus on gaining the missing technical skills mentioned above.";
  }
}

module.exports = { extractSkills, generateSuggestions };