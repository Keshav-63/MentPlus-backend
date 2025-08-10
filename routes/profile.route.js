import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { completeMentorProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// This route is protected; only a logged-in user can access it.
router.post("/complete", verifyToken, completeMentorProfile);

export default router;
