// Run this manually if you're using a real MongoDB and want to (re)seed
// the achievement catalogue directly:
//   node src/utils/seedAchievements.js
//
// Not needed for the embedded/default setup - the server auto-seeds on
// startup (see seedAchievementsIfNeeded in this same folder).
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { Achievement } from "../models/Achievement.js";
import { DEFAULT_ACHIEVEMENTS } from "../data/defaultAchievements.js";

dotenv.config();

async function run() {
  await connectDB();
  for (const a of DEFAULT_ACHIEVEMENTS) {
    await Achievement.findOneAndUpdate({ key: a.key }, a, { upsert: true, new: true });
  }
  console.log(`Seeded ${DEFAULT_ACHIEVEMENTS.length} achievements.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
