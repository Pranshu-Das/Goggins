import { useEffect, useState } from "react";
import api from "../api/axios.js";
import XPBar from "../components/XPBar.jsx";
import StreakDisplay from "../components/StreakDisplay.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load stats"));
  }, []);

  if (error) return <div className="page-center error-text">{error}</div>;
  if (!stats) return <div className="page-center">Loading...</div>;

  const { user, xpIntoCurrentLevel, xpNeededForNextLevel, achievements } = stats;

  return (
    <div className="page">
      <h1>Welcome back, {user.username}</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <XPBar
            level={user.level}
            xpIntoCurrentLevel={xpIntoCurrentLevel}
            xpNeededForNextLevel={xpNeededForNextLevel}
          />
        </div>

        <div className="dashboard-card">
          <StreakDisplay current={user.currentGlobalStreak} longest={user.longestGlobalStreak} />
        </div>

        <div className="dashboard-card">
          <h3>Total habits completed</h3>
          <p className="big-stat">{user.totalHabitsCompleted}</p>
        </div>
      </div>

      <h2>Achievements ({achievements.length})</h2>
      <div className="achievement-grid">
        {achievements.length === 0 && <p>No achievements unlocked yet — go check in a habit!</p>}
        {achievements.map((a) => (
          <div key={a._id} className="achievement-badge">
            <span className="achievement-icon">{a.icon}</span>
            <div>
              <strong>{a.title}</strong>
              <p>{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
