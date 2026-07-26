export default function XPBar({ level, xpIntoCurrentLevel, xpNeededForNextLevel }) {
  const percent = xpNeededForNextLevel
    ? Math.min(100, Math.round((xpIntoCurrentLevel / xpNeededForNextLevel) * 100))
    : 0;

  return (
    <div className="xp-bar-wrapper">
      <div className="xp-bar-label">
        <span>Level {level}</span>
        <span>
          {xpIntoCurrentLevel} / {xpNeededForNextLevel} XP
        </span>
      </div>
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
