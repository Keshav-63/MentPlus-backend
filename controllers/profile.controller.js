import { MentorProfile } from "../models/mentorProfile.model.js";
import { User } from "../models/user.model.js";

export const completeMentorProfile = async (req, res) => {
    try {
        const { userId } = req;
        const profileData = req.body;

        const user = await User.findById(userId);
        if (!user || user.role !== 'mentor') {
            return res.status(403).json({ message: "Forbidden: Only mentors can complete a profile." });
        }

        // Use findOneAndUpdate with upsert to either create a new profile or update an existing one
        const updatedProfile = await MentorProfile.findOneAndUpdate(
            { userId: userId }, // find a document with this filter
            { ...profileData, userId: userId }, // document to insert when nothing is found
            { new: true, upsert: true, runValidators: true } // options
        );

        // Mark the user's profile as complete
        user.profileComplete = true;
        await user.save();

        // Return the updated user object (without the password)
        const updatedUser = await User.findById(userId).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile completed successfully!",
            user: updatedUser,
            profile: updatedProfile
        });

    } catch (error) {
        console.error("Error in completeMentorProfile controller:", error);
        res.status(500).json({ message: "Server error while completing profile." });
    }
};
