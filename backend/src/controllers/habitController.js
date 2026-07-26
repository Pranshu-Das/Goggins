import asyncHandler from "express-async-handler";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import User from "../models/User.js";
import { todayString, computeNewStreak } from "../utils/streakSystem.js";
import { calculateXpForCompletion, computeLevelFromXp } from "../utils/xpSystem.js";
import { checkAndUnlockAchievements } from "../utils/achievementSystem.js";

// @route POST /api/habits
export const createHabit = asyncHandler(async (req, res) => {
  const { title, description, category, frequency, difficulty } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const habit = await Habit.create({
    user: req.user._id,
    title,
    description,
    category,
    frequency,
    difficulty,
  });

  res.status(201).json(habit);
});

// @route GET /api/habits
export const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id, active: true }).sort({ createdAt: -1 });
  res.json(habits);
});

// @route PUT /api/habits/:id
export const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  const editableFields = ["title", "description", "category", "frequency", "difficulty", "active"];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) habit[field] = req.body[field];
  });

  await habit.save();
  res.json(habit);
});

// @route DELETE /api/habits/:id
export const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }
  res.json({ message: "Habit deleted" });
});

// @route POST /api/habits/:id/checkin
// This is the heart of the gamification loop: mark a habit done for today,
// update its streak, award XP, update the user's level/global streak, and
// check for newly unlocked achievements.
export const checkInHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  const today = todayString();

  // Prevent double check-in for the same day (also enforced by the unique index)
  const existingLog = await HabitLog.findOne({ habit: habit._id, date: today });
  if (existingLog) {
    res.status(400);
    throw new Error("Habit already checked in today");
  }

  // --- Update per-habit streak ---
  const newHabitStreak = computeNewStreak(habit.lastCompletedDate, habit.currentStreak, today);
  habit.currentStreak = newHabitStreak;
  habit.longestStreak = Math.max(habit.longestStreak, newHabitStreak);
  habit.lastCompletedDate = today;
  habit.totalCompletions += 1;
  await habit.save();

  // --- Award XP ---
  const xpEarned = calculateXpForCompletion({
    difficulty: habit.difficulty,
    streakAfterCompletion: newHabitStreak,
  });

  await HabitLog.create({ habit: habit._id, user: req.user._id, date: today, xpEarned });

  // --- Update user: global streak, xp, level, totals ---
  const user = await User.findById(req.user._id);
  const newGlobalStreak = computeNewStreak(user.lastActiveDate, user.currentGlobalStreak, today);
  user.currentGlobalStreak = newGlobalStreak;
  user.longestGlobalStreak = Math.max(user.longestGlobalStreak, newGlobalStreak);
  user.lastActiveDate = today;
  user.totalHabitsCompleted += 1;

  user.xp += xpEarned;
  const { level } = computeLevelFromXp(user.xp);
  const leveledUp = level > user.level;
  user.level = level;

  await user.save();

  const newlyUnlockedAchievements = await checkAndUnlockAchievements(user);

  res.json({
    habit,
    xpEarned,
    user,
    leveledUp,
    newlyUnlockedAchievements,
  });
});
