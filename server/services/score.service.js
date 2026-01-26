const skillAliases = {
  "js": "javascript",
  "reactjs": "react",
  "node": "nodejs",
  "express": "expressjs",
  "aws": "amazonwebservices",
  "ml": "machinelearning",
  "ai": "artificialintelligence",
  "c++": "cpp",
  "c#": "csharp",
  "dot net": "dotnet"
};

function normalize(skill) {
  return skill
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function getCanonical(skill) {
  const norm = normalize(skill);
  return skillAliases[norm] || norm;
}

function calculateScore(resumeSkills = [], jobSkills = []) {
  if (jobSkills.length === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: []
    };
  }

  const resumeNorms = resumeSkills.map(getCanonical);
  const jobNorms = jobSkills.map(getCanonical);
  
  const matched = [];
  const missing = [];

  for (const jobSkill of jobNorms) {
    const isMatched = resumeNorms.some(resumeSkill => {
      if (resumeSkill === jobSkill) return true;
      if (resumeSkill.includes(jobSkill) || jobSkill.includes(resumeSkill)) return true;
      return false;
    });

    if (isMatched) {
      matched.push(jobSkill);
    } else {
      missing.push(jobSkill);
    }
  }

  const uniqueMatches = [...new Set(matched)];
  const uniqueJobSkills = [...new Set(jobNorms)];

  const score = Math.round((uniqueMatches.length / uniqueJobSkills.length) * 100);

  return {
    score,
    matchedSkills: uniqueMatches,
    missingSkills: missing
  };
}

module.exports = { calculateScore };
