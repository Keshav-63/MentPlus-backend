import express from "express";
import { getExploreData } from "../controllers/explore.controller.js";

const router = express.Router();

// This is a public route, no token is needed to explore mentors.
router.get("/", getExploreData);

export default router;
