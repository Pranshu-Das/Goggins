import { Achievement } from "../models/Achievement.js";
import { DEFAULT_ACHIEVEMENTS } from "../data/defaultAchievements.js";

// Called once when the server starts. Cheap no-op if achievements already
// exist, so it's safe to call on every boot.
export async function seedAchievementsIfNeeded() {
  const count = await Achievement.countDocuments();
  if (count > 0) return;

  await Achievement.insertMany(DEFAULT_ACHIEVEMENTS);
  console.log(`Seeded ${DEFAULT_ACHIEVEMENTS.length} default achievements.`);
}
