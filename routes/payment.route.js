import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { 
    createBookingOrder, 
    verifyPayment, 
    getMentorBookings,
    createGroupSessionOrder,
    verifyGroupSessionPayment
} from "../controllers/payment.controller.js";

const router = express.Router();

// --- 1-on-1 Booking Routes ---
router.post("/create-order", verifyToken, createBookingOrder);
router.post("/verify-payment", verifyToken, verifyPayment);

// --- Group Session Booking Routes ---
router.post("/create-group-order", verifyToken, createGroupSessionOrder);
router.post("/verify-group-payment", verifyToken, verifyGroupSessionPayment);

// --- Mentor Route ---
router.get("/mentor-bookings", verifyToken, getMentorBookings);

export default router;
