import express from "express";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  checkInHabit,
} from "../controllers/habitController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // every habit route requires auth

router.route("/").post(createHabit).get(getHabits);
router.route("/:id").put(updateHabit).delete(deleteHabit);
router.post("/:id/checkin", checkInHabit);

export default router;
