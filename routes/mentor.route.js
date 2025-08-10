import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getMentorDashboardData, handleBookingRequest } from "../controllers/mentor.controller.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getMentorDashboardData);
router.patch("/bookings/:bookingId", verifyToken, handleBookingRequest);

export default router;
