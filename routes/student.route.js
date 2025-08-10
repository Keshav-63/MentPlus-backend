import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { saveStudentSubjects,  getStudentDashboardData } from "../controllers/student.controller.js";

const router = express.Router();

// This route is protected; only a logged-in student can save their subjects.
router.post("/save-subjects", verifyToken, saveStudentSubjects);
// --- NEW ROUTE FOR DASHBOARD DATA ---
router.get("/dashboard", verifyToken, getStudentDashboardData);

export default router;
