import express from "express";
import { getUserStats } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protect, getUserStats);

export default router;
