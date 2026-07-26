import mongoose from "mongoose";

// Static catalogue of achievements. Seed these once (see src/utils/seedAchievements.js note below,
// or just insert manually / write a seed script) — this model just describes the shape.
const achievementSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. "streak_7"
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: "🏆" },
  // How this achievement is checked — kept simple and declarative so the
  // checker in utils/achievementSystem.js can evaluate it generically.
  type: {
    type: String,
    enum: ["global_streak", "level", "total_completions", "habit_streak"],
    required: true,
  },
  threshold: { type: Number, required: true },
});

export const Achievement = mongoose.model("Achievement", achievementSchema);

const userAchievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    achievement: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement", required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

export const UserAchievement = mongoose.model("UserAchievement", userAchievementSchema);
