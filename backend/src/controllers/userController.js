import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { UserAchievement } from "../models/Achievement.js";
import { computeLevelFromXp } from "../utils/xpSystem.js";

// @route GET /api/users/stats
// Returns everything the dashboard needs in one call: xp/level progress,
// streaks, and unlocked achievements.
export const getUserStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { xpIntoCurrentLevel, xpNeededForNextLevel } = computeLevelFromXp(user.xp);

  const unlockedAchievements = await UserAchievement.find({ user: user._id }).populate("achievement");

  res.json({
    user,
    xpIntoCurrentLevel,
    xpNeededForNextLevel,
    achievements: unlockedAchievements.map((ua) => ({
      ...ua.achievement.toObject(),
      unlockedAt: ua.unlockedAt,
    })),
  });
});
