import { Achievement, UserAchievement } from "../models/Achievement.js";

/**
 * Checks all achievement definitions against the user's current stats and
 * unlocks any newly-earned ones. Call this after any action that changes
 * xp/level/streaks/totalCompletions (e.g. right after a habit check-in).
 *
 * Returns the list of newly unlocked achievements (empty array if none),
 * so the API/frontend can show a "Achievement unlocked!" toast.
 */
export async function checkAndUnlockAchievements(user) {
  const allAchievements = await Achievement.find();
  if (allAchievements.length === 0) return [];

  const alreadyUnlocked = await UserAchievement.find({ user: user._id }).select("achievement");
  const unlockedIds = new Set(alreadyUnlocked.map((ua) => ua.achievement.toString()));

  const newlyUnlocked = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement._id.toString())) continue;

    const earned = evaluateAchievement(achievement, user);
    if (earned) {
      await UserAchievement.create({ user: user._id, achievement: achievement._id });
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}

function evaluateAchievement(achievement, user) {
  switch (achievement.type) {
    case "global_streak":
      return user.currentGlobalStreak >= achievement.threshold;
    case "level":
      return user.level >= achievement.threshold;
    case "total_completions":
      return user.totalHabitsCompleted >= achievement.threshold;
    // "habit_streak" (per-habit streak) is checked separately in the habit
    // controller since it needs the specific Habit doc, not the User doc.
    default:
      return false;
  }
}
