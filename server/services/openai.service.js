const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

async function extractSkills(text) {
  if (!text || text.trim().length < 10) {
    return [];
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "Extract a precise list of technical skills and soft skills. Return ONLY a JSON object with a key 'skills' containing an array of strings."
        },
        {
          role: "user",
          content: `Extract skills from: ${text}`
        }
      ]
    });

    const parsed = JSON.parse(response.data.choices[0].message.content);
    const skills = parsed.skills || [];
    return [...new Set(skills.map(s => s.toLowerCase().trim()))];
  } catch (err) {
    return [];
  }
}

async function generateSuggestions(missingSkills) {
  if (!missingSkills || missingSkills.length === 0) {
    return "Your resume is a strong match!";
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: "You are a career strategist. Suggest specific projects to bridge skill gaps. Output exactly 3 bullet points."
        },
        {
          role: "user",
          content: `Missing skills: ${missingSkills.join(", ")}`
        }
      ]
    });

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    return "Focus on building a portfolio project with missing skills.";
  }
}

module.exports = { extractSkills, generateSuggestions };
