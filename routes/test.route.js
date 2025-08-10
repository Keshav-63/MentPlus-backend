import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getTestQuestions, submitTest } from "../controllers/test.controller.js";

const router = express.Router();

router.get("/questions/:domain", verifyToken, getTestQuestions);
router.post("/submit", verifyToken, submitTest);

export default router;