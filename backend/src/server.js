import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { seedAchievementsIfNeeded } from "./utils/seedOnStartup.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/users", userRoutes);

// Serve the built React app (frontend/dist) if it exists, so the whole
// app can run as a single process on a single port — run `npm run build`
// in /frontend first to generate this folder.
const frontendDist = path.join(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send(
      "Frontend not built yet. Run 'npm run build' inside /frontend, then restart the backend."
    );
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Wait for the database (embedded or real) to finish connecting before
// accepting traffic, so the very first requests don't race the DB setup.
connectDB().then(async () => {
  await seedAchievementsIfNeeded();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
