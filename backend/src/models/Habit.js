import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 300, default: "" },
    category: {
      type: String,
      enum: ["health", "fitness", "study", "work", "mindfulness", "other"],
      default: "other",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    // Difficulty drives base XP reward — see utils/xpSystem.js
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    active: { type: Boolean, default: true },

    // --- Per-habit streak state ---
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompletedDate: { type: String, default: null }, // "YYYY-MM-DD"
    totalCompletions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
