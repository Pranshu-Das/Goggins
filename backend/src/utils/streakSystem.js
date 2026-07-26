// Streak math, kept as pure functions so it's easy to unit test.

export function todayString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function daysBetween(dateA, dateB) {
  const a = new Date(dateA + "T00:00:00Z");
  const b = new Date(dateB + "T00:00:00Z");
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

/**
 * Given the last completed date and today's date, decide the new streak count.
 * - Same day as lastCompletedDate: no-op (shouldn't happen, HabitLog unique index prevents dupes)
 * - Exactly 1 day after: streak continues (+1)
 * - More than 1 day gap: streak resets to 1 (today's completion starts a new streak)
 * - No previous date: streak starts at 1
 */
export function computeNewStreak(lastCompletedDate, currentStreak, today = todayString()) {
  if (!lastCompletedDate) return 1;

  const gap = daysBetween(lastCompletedDate, today);

  if (gap === 0) return currentStreak; // already logged today
  if (gap === 1) return currentStreak + 1; // consecutive day
  return 1; // streak broken, restart
}
