import { Booking } from "../models/booking.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import Razorpay from "razorpay";
import { randomUUID } from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const getMentorDashboardData = async (req, res) => {
  try {
    const mentorId = req.userId;
    const now = new Date();

    const bookingRequests = await Booking.find({
      mentorId,
      status: "pending_approval",
    })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });
    const notifications = await Notification.find({
      userId: mentorId,
      isRead: false,
    }).sort({ createdAt: -1 });
    const completedBookings = await Booking.find({
      mentorId,
      status: "completed",
    }).populate("studentId", "name");

    let totalEarnings = 0;
    const transactions = completedBookings.map((b) => {
      totalEarnings += b.paymentDetails.mentorEarnings;
      return {
        _id: b._id,
        studentName: b.studentId.name,
        amount: b.paymentDetails.mentorEarnings / 100,
        date: b.updatedAt,
      };
    });

    // --- UPDATED: Categorize all sessions for the mentor ---
    // --- UPDATED: Categorize all sessions for the mentor ---
    const groupSessions = await Session.find({
      mentorId,
      status: { $in: ["upcoming", "completed"] },
    });
    const approvedBookings = await Booking.find({
      mentorId,
      status: { $in: ["approved", "completed"] },
    }).populate("studentId", "name");

    const allSessions = [...groupSessions, ...approvedBookings];
    const upcoming = [];
    const ongoing = [];
    const completed = []; // This is for display; stats are calculated from completedBookings

    allSessions.forEach((session) => {
      const sessionTime = new Date(session.dateTime || session.scheduledTime);
      const duration =
        session.duration || session.sessionDetails?.duration || 60;
      const endTime = new Date(sessionTime.getTime() + duration * 60000);

      if (session.status === "completed") {
        completed.push(session);
      } else if (now >= sessionTime && now < endTime) {
        ongoing.push(session);
      } else if (now < sessionTime) {
        upcoming.push(session);
      }
    });

    const stats = {
      totalSessions: completedBookings.length,
      totalEarnings: totalEarnings / 100,
      averageRating: 4.8, // Placeholder
      totalStudents: new Set(
        completedBookings.map((b) => b.studentId._id.toString())
      ).size,
    };

    res.status(200).json({
      success: true,
      bookingRequests,
      notifications,
      stats,
      transactions,
      upcomingSessions: upcoming,
      ongoingSessions: ongoing,
      completedSessions: completed,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching mentor dashboard data." });
  }
};

export const handleBookingRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { action } = req.body;
    const mentorId = req.userId;
    const mentor = await User.findById(mentorId);

    if (!mentor) return res.status(404).json({ message: "Mentor not found." });

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.mentorId.toString() !== mentorId) {
      return res
        .status(404)
        .json({ message: "Booking not found or you are not authorized." });
    }

    if (action === "approve") {
      booking.status = "approved";
      booking.roomId = randomUUID();
      booking.scheduledTime = booking.requestedDateTime;
      await Notification.create({
        userId: booking.studentId,
        message: `Your session with ${mentor.name} is confirmed!`,
        link: "/student-dashboard",
      });
    } else if (action === "reject") {
      booking.status = "rejected";
      await razorpay.payments.refund(booking.paymentDetails.paymentId, {
        amount: booking.paymentDetails.amount,
        speed: "normal",
      });
      booking.paymentDetails.status = "refunded";
      await Notification.create({
        userId: booking.studentId,
        message: `Your session with ${
          mentor.name
        } was rejected. Your payment of ₹${
          booking.paymentDetails.amount / 100
        } has been refunded.`,
        link: "/student-dashboard",
      });
    } else {
      return res.status(400).json({ message: "Invalid action." });
    }

    await booking.save();
    res
      .status(200)
      .json({ success: true, message: `Booking has been ${action}.` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while handling booking request." });
  }
};
