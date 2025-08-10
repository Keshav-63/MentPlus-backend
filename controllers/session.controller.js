import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";

export const getMySessions = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        let sessions;
        if (user.role === 'mentor') {
            // If the user is a mentor, find all sessions they have created.
            sessions = await Session.find({ mentorId: userId }).sort({ dateTime: -1 }); // Sort by newest first
        } else {
            // If the user is a student, find all sessions they are a participant in.
            // (Note: We will implement adding participants in a future step)
            sessions = await Session.find({ participants: userId }).sort({ dateTime: -1 });
        }

        res.status(200).json({ success: true, sessions });

    } catch (error) {
        console.error("Error in getMySessions controller:", error);
        res.status(500).json({ message: "Server error while fetching sessions." });
    }
};

export const createGroupSession = async (req, res) => {
    try {
        console.log("Creating group session with data:", req.body);
        const { userId } = req; // This comes from our verifyToken middleware
        const { title, description, date, time, duration, maxParticipants, pricePerStudent } = req.body;

        // Find the mentor to get their domain
        const mentor = await User.findById(userId);
        if (!mentor || mentor.role !== 'mentor') {
            return res.status(403).json({ message: "Forbidden: Only mentors can create sessions." });
        }

        // Combine date and time strings into a single Date object
        const dateTime = new Date(`${date}T${time}`);

        const newSession = new Session({
            title,
            description,
            mentorId: userId,
            domain: mentor.domain, // Get domain from the mentor's profile
            dateTime,
            duration,
            maxParticipants,
            pricePerStudent,
            sessionType: 'group', // Explicitly set as group session
        });

        await newSession.save();

        res.status(201).json({
            success: true,
            message: "Group session created successfully!",
            session: newSession,
        });

    } catch (error) {
        console.error("Error in createGroupSession controller:", error);
        res.status(500).json({ message: "Server error while creating session." });
    }
};

// --- NEW FUNCTION to get group sessions a student can join ---
export const getAvailableGroupSessions = async (req, res) => {
    try {
        const studentId = req.userId;
        // Find upcoming group sessions where the student is NOT already a participant
        const sessions = await Session.find({
            sessionType: 'group',
            status: 'upcoming',
            dateTime: { $gt: new Date() },
            participants: { $ne: studentId } // Exclude sessions they've already joined
        }).populate('mentorId', 'name').sort({ dateTime: 1 });

        res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error("Error fetching available group sessions:", error);
        res.status(500).json({ message: "Server error while fetching sessions." });
    }
};
