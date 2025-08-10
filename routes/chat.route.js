import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getChatConnections, generateZimToken  } from "../controllers/chat.controller.js";

const router = express.Router();

// This route is protected; only a logged-in user can get their chat list.
router.get("/connections", verifyToken, getChatConnections);
console.log("Chat connections route initialized");
router.get("/token", verifyToken, generateZimToken);
export default router; 