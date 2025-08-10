import { User } from "../models/user.model.js";
import { MentorProfile } from "../models/mentorProfile.model.js";
import { Session } from "../models/session.model.js";

export const getExploreData = async (req, res) => {
    try {
        // 1. Find all users who are mentors and have completed their profile.
        const mentors = await User.find({
            role: 'mentor',
            isVerified: true,
            profileComplete: true,
        }).select("-password"); // Exclude password from the result

        // 2. Get the detailed profiles for these mentors.
        // We use Promise.all for efficient parallel fetching.
        const mentorProfiles = await Promise.all(
            mentors.map(async (mentor) => {
                const profile = await MentorProfile.findOne({ userId: mentor._id });
                // Combine the base user info (name, domain) with the detailed profile
                return { ...mentor.toObject(), profile };
            })
        );

        // 3. Find all upcoming group sessions.
        const upcomingSessions = await Session.find({
            sessionType: 'group',
            status: 'upcoming',
            dateTime: { $gt: new Date() } // Only fetch sessions in the future
        }).populate('mentorId', 'name').sort({ dateTime: 1 }); // Populate mentor's name and sort by soonest

        res.status(200).json({
            success: true,
            mentors: mentorProfiles,
            sessions: upcomingSessions,
        });

    } catch (error) {
        console.error("Error in getExploreData controller:", error);
        res.status(500).json({ message: "Server error while fetching explore data." });
    }
};
