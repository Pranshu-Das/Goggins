import { useState } from "react";
import api from "../api/axios.js";

const DIFFICULTY_COLOR = { easy: "#4ade80", medium: "#facc15", hard: "#f87171" };

export default function HabitCard({ habit, onCheckedIn, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const doneToday = habit.lastCompletedDate === today;

  const handleCheckIn = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/habits/${habit._id}/checkin`);
      onCheckedIn(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`habit-card ${doneToday ? "habit-card-done" : ""}`}>
      <div className="habit-card-header">
        <h3>{habit.title}</h3>
        <span
          className="habit-difficulty-badge"
          style={{ backgroundColor: DIFFICULTY_COLOR[habit.difficulty] }}
        >
          {habit.difficulty}
        </span>
      </div>
      {habit.description && <p className="habit-description">{habit.description}</p>}
      <div className="habit-card-footer">
        <span>🔥 {habit.currentStreak} streak</span>
        <span>✅ {habit.totalCompletions} total</span>
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="habit-card-actions">
        <button disabled={doneToday || loading} onClick={handleCheckIn}>
          {doneToday ? "Done today ✓" : loading ? "Checking in..." : "Check in"}
        </button>
        <button className="btn-secondary" onClick={() => onDelete(habit._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
