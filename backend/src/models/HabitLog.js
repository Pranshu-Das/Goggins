import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: String, required: true }, // "YYYY-MM-DD", the day this check-in counts for
    xpEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// A habit can only be logged once per day
habitLogSchema.index({ habit: 1, date: 1 }, { unique: true });

export default mongoose.model("HabitLog", habitLogSchema);
