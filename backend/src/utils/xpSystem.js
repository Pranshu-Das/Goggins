// The "engine" of the gamification loop. Tune these numbers to change how the app feels.

const BASE_XP_BY_DIFFICULTY = {
  easy: 10,
  medium: 20,
  hard: 35,
};

// Small bonus for consecutive-day momentum, capped so long streaks don't spiral out of control.
// e.g. a 10-day streak gives +10 * 2 = 20% bonus, capped at +100% (2x) at a 50-day streak.
export function streakBonusMultiplier(currentStreak) {
  const bonusPercent = Math.min(currentStreak * 2, 100);
  return 1 + bonusPercent / 100;
}

export function calculateXpForCompletion({ difficulty, streakAfterCompletion }) {
  const base = BASE_XP_BY_DIFFICULTY[difficulty] ?? BASE_XP_BY_DIFFICULTY.medium;
  const multiplier = streakBonusMultiplier(streakAfterCompletion);
  return Math.round(base * multiplier);
}

// RPG-style curve: XP required to COMPLETE level N (i.e. to go from N to N+1).
// Level 1->2 needs 100, 2->3 needs ~141, 3->4 needs ~173, growing with sqrt-ish curve.
// Feel free to swap for a flatter or steeper curve.
export function xpRequiredForLevel(level) {
  return Math.round(100 * Math.sqrt(level));
}

// Given total lifetime XP, derive current level and progress toward the next one.
export function computeLevelFromXp(totalXp) {
  let level = 1;
  let xpRemaining = totalXp;

  while (xpRemaining >= xpRequiredForLevel(level)) {
    xpRemaining -= xpRequiredForLevel(level);
    level += 1;
  }

  return {
    level,
    xpIntoCurrentLevel: xpRemaining,
    xpNeededForNextLevel: xpRequiredForLevel(level),
  };
}
