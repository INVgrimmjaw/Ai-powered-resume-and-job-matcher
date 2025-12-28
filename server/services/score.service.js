/**
 * Normalize skill text for fair comparison
 */
function normalize(skill) {
  return skill
    .toLowerCase()
    .replace(/[^a-z0-9.+#]/g, "")
    .trim();
}

/**
 * Calculate resume-job match score
 * @param {string[]} resumeSkills
 * @param {string[]} jobSkills
 * @returns {Object}
 */
function calculateScore(resumeSkills = [], jobSkills = []) {
  if (jobSkills.length === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: []
    };
  }

  const resumeSet = new Set(resumeSkills.map(normalize));
  const jobSet = new Set(jobSkills.map(normalize));

  const matched = [];
  const missing = [];

  for (const skill of jobSet) {
    if (resumeSet.has(skill)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  // ATS-style scoring
  const score = Math.round((matched.length / jobSet.size) * 100);

  return {
    score,
    matchedSkills: matched,
    missingSkills: missing
  };
}

module.exports = { calculateScore };
