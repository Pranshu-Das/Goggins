import { useEffect, useState } from "react";
import api from "../api/axios.js";
import HabitCard from "../components/HabitCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Habits() {
  const { setUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    difficulty: "medium",
  });
  const [toast, setToast] = useState(null);

  const loadHabits = async () => {
    const { data } = await api.get("/habits");
    setHabits(data);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/habits", form);
    setForm({ title: "", description: "", category: "other", difficulty: "medium" });
    setShowForm(false);
    loadHabits();
  };

  const handleDelete = async (id) => {
    await api.delete(`/habits/${id}`);
    loadHabits();
  };

  const handleCheckedIn = ({ habit, xpEarned, user, leveledUp, newlyUnlockedAchievements }) => {
    setHabits((prev) => prev.map((h) => (h._id === habit._id ? habit : h)));
    setUser(user);

    let message = `+${xpEarned} XP!`;
    if (leveledUp) message += ` 🎉 Level up! You're now level ${user.level}.`;
    if (newlyUnlockedAchievements?.length) {
      message += ` Unlocked: ${newlyUnlockedAchievements.map((a) => a.title).join(", ")}`;
    }
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Habits</h1>
        <button onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ New Habit"}</button>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showForm && (
        <form className="habit-form" onSubmit={handleCreate}>
          <input
            placeholder="Habit title (e.g. Wake up at 6am)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="health">Health</option>
            <option value="fitness">Fitness</option>
            <option value="study">Study</option>
            <option value="work">Work</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="other">Other</option>
          </select>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            <option value="easy">Easy (10 XP)</option>
            <option value="medium">Medium (20 XP)</option>
            <option value="hard">Hard (35 XP)</option>
          </select>
          <button type="submit">Create Habit</button>
        </form>
      )}

      <div className="habit-grid">
        {habits.map((habit) => (
          <HabitCard
            key={habit._id}
            habit={habit}
            onCheckedIn={handleCheckedIn}
            onDelete={handleDelete}
          />
        ))}
        {habits.length === 0 && <p>No habits yet — create your first one to start earning XP.</p>}
      </div>
    </div>
  );
}
