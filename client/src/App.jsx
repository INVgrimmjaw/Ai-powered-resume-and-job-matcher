import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [view, setView] = useState("main");
  const [history, setHistory] = useState([]);
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleViewHistory = async () => {
    try {
      const historyRes = await axios.get("http://localhost:5000/api/history");
      setHistory(historyRes.data);
      setView("history");
    } catch (err) {
      console.error(err);
      alert("Could not load history.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDesc);

    try {
      await axios.post("http://localhost:5000/api/match", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Success. Check the History tab.");
      handleViewHistory();
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 70) return "score-badge score-high";
    if (score >= 40) return "score-badge score-med";
    return "score-badge score-low";
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Resume Matcher</h1>
        {view === "main" && (
          <button className="btn btn-primary" onClick={handleViewHistory}>
            View History
          </button>
        )}
        {view === "history" && (
          <button className="btn btn-secondary" onClick={() => setView("main")}>
            Back to Upload
          </button>
        )}
      </div>

      {view === "main" && (
        <div className="card">
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Upload Resume</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <div className="form-group">
              <label>Job Description</label>
              <textarea
                className="form-control"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here..."
                required
              />
            </div>

            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? "Analyzing Match..." : "Analyze Resume"}
            </button>
          </form>
        </div>
      )}

      {view === "history" && (
        <div className="history-list">
          {history.length === 0 ? <p>No history found.</p> : null}

          {history.map((match) => (
            <div key={match._id} className="history-card">
              <div className="card-header">
                <span className="date">
                  {new Date(match.createdAt).toLocaleDateString()} at {new Date(match.createdAt).toLocaleTimeString()}
                </span>
                <div className={getScoreClass(match.matchScore)}>
                  {match.matchScore}% Match
                </div>
              </div>

              <div className="missing-skills">
                <strong>Missing Skills: </strong>
                {match.missingSkills.length > 0 ? match.missingSkills.join(", ") : "None"}
              </div>

              <div className="ai-advice">
                <strong>Suggestion:</strong>
                <div>{match.aiSuggestions}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;