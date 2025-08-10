import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import { Session } from "../models/session.model.js";
import { MentorProfile } from "../models/mentorProfile.model.js";

// --- NEW DASHBOARD DATA FUNCTION ---
export const getStudentDashboardData = async (req, res) => {
    try {
        const { userId } = req;
        const now = new Date();

        // 1. Fetch all mentors (this remains the same)
        const mentors = await User.find({ role: 'mentor', profileComplete: true }).select("-password");
        const mentorProfiles = await Promise.all(mentors.map(async (mentor) => {
            const profile = await MentorProfile.findOne({ userId: mentor._id });
            return { ...mentor.toObject(), profile };
        }));

        // 2. Fetch all relevant bookings and sessions for the student
        const myBookings = await Booking.find({ studentId: userId, status: { $in: ['approved', 'completed'] } }).populate('mentorId', 'name');
        const myGroupSessions = await Session.find({ participants: userId, status: { $in: ['upcoming', 'completed'] } }).populate('mentorId', 'name');

        // 3. Categorize all sessions based on their current time status
        const allSessions = [...myBookings, ...myGroupSessions];
        const upcoming = [];
        const ongoing = [];
        const completed = [];

        allSessions.forEach(session => {
            const sessionTime = new Date(session.scheduledTime || session.dateTime);
            const duration = session.duration || session.sessionDetails?.duration || 60; // Default to 60 mins
            const endTime = new Date(sessionTime.getTime() + duration * 60000);

            if (session.status === 'completed') {
                completed.push(session);
            } else if (now >= sessionTime && now < endTime) {
                ongoing.push(session);
            } else if (now < sessionTime) {
                upcoming.push(session);
            }
            // Sessions where endTime < now are implicitly 'past' but will be marked 'completed' by a separate process
        });

        // 4. Fetch transactions (this remains the same)
        const myTransactions = await Booking.find({
            studentId: userId,
            'paymentDetails.status': { $in: ['captured', 'refunded'] }
        }).select('paymentDetails mentorId createdAt status').populate('mentorId', 'name');

        res.status(200).json({
            success: true,
            mentors: mentorProfiles,
            upcomingSessions: upcoming,
            ongoingSessions: ongoing,
            completedSessions: completed,
            myTransactions,
        });

    } catch (error) {
        console.error("Error in getStudentDashboardData controller:", error);
        res.status(500).json({ message: "Server error while fetching dashboard data." });
    }
};

export const saveStudentSubjects = async (req, res) => {
    try {
        const { userId } = req; // This comes from our verifyToken middleware
        const { subjects } = req.body;

        if (!subjects || !Array.isArray(subjects)) {
            return res.status(400).json({ message: "An array of subjects is required." });
        }

        const user = await User.findById(userId);

        if (!user || user.role !== 'student') {
            return res.status(403).json({ message: "Forbidden: Only students can save subjects." });
        }

        user.subjects = subjects;
        await user.save();

        // Return the final, updated user object (without the password)
        const updatedUser = await User.findById(userId).select("-password");

        res.status(200).json({
            success: true,
            message: "Subjects saved successfully!",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Error in saveStudentSubjects controller:", error);
        res.status(500).json({ message: "Server error while saving subjects." });
    }
};
