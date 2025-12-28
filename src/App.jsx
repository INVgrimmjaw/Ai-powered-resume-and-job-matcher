import { useState } from "react";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!resume || !jobDesc.trim()) {
      setError("Please upload a resume and paste a job description.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDesc);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-2">
          AI Resume & Job Matcher
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Match your resume with job descriptions using AI
        </p>

        {/* Resume Upload */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-2">
            Upload Resume
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            rows="6"
            placeholder="Paste job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-center mt-4 font-medium">
            {error}
          </p>
        )}

        {/* Results */}
        {result && (
          <div className="mt-10 border-t pt-6">
            {/* Score */}
            <div className="flex justify-center mb-6">
              <div className="px-6 py-3 rounded-full bg-green-100 text-green-700 text-2xl font-bold">
                {result.matchScore}% Match
              </div>
            </div>

            {/* Matched Skills */}
            <div className="mb-5">
              <p className="font-semibold text-gray-700 mb-2">
                Matched Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.length ? (
                  result.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mb-5">
              <p className="font-semibold text-gray-700 mb-2">
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.length ? (
                  result.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <p className="font-semibold text-gray-700 mb-2">
                Suggestions
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
                {result.suggestions}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;