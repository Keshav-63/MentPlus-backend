import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createGroupSession, getMySessions , getAvailableGroupSessions} from "../controllers/session.controller.js";

const router = express.Router();

// This route is protected; only a logged-in user (a mentor) can create a session.
router.post("/create-group", verifyToken, createGroupSession);
// --- NEW ROUTE TO FETCH USER'S SESSIONS ---
router.get("/my-sessions", verifyToken, getMySessions);
// --- NEW ROUTE to get available group sessions ---
router.get("/available-group", verifyToken, getAvailableGroupSessions);

export default router;
