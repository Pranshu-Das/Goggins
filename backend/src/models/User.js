import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never return password by default
    },
    avatar: {
      type: String,
      default: "default", // key into a frontend avatar/asset map
    },

    // --- Gamification state ---
    xp: { type: Number, default: 0 }, // total lifetime XP
    level: { type: Number, default: 1 },

    // Global "did I show up today at all" streak, separate from per-habit streaks
    currentGlobalStreak: { type: Number, default: 0 },
    longestGlobalStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null }, // "YYYY-MM-DD"

    totalHabitsCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving, only if it changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Never leak password hash even if select() is bypassed somewhere
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
