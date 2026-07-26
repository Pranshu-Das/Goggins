export default function StreakDisplay({ current, longest }) {
  return (
    <div className="streak-card">
      <div className="streak-current">
        <span className="streak-flame">🔥</span>
        <span className="streak-number">{current}</span>
        <span className="streak-text">day streak</span>
      </div>
      <div className="streak-longest">Longest: {longest} days</div>
    </div>
  );
}
