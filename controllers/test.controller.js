import axios from 'axios';
import { Question } from "../models/question.model.js";
import { TestAttempt } from "../models/testAttempt.model.js";
import { User } from "../models/user.model.js";

// Helper function to get the public IP address
const getIpAddress = async (req) => {
    try {
        // First, try the third-party API for accuracy behind proxies
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        // Fallback to Express's req.ip if the API fails
        console.warn("Could not fetch IP from third-party API, falling back to req.ip.", error.message);
        return req.ip;
    }
};

// Fetch 15 random questions for a given domain
export const getTestQuestions = async (req, res) => {
    try {
        const { domain } = req.params;
        const questions = await Question.aggregate([
            { $match: { domain } },
            { $sample: { size: 15 } },
            { $project: { questionText: 1, options: 1 } } // Only send necessary fields
        ]);

        if (questions.length < 15) {
            return res.status(404).json({ message: "Not enough questions for this domain yet." });
        }

        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching questions", error: error.message });
    }
};

// Submit test answers, calculate score, and block IP on failure
export const submitTest = async (req, res) => {
    try {
        const { userId } = req;
        const { answers } = req.body;
        const ipAddress = await getIpAddress(req);

        if (!ipAddress) {
            return res.status(400).json({ message: "Could not determine IP address. Cannot proceed." });
        }

        // Check if this user or IP has a previously failed attempt
        const failedAttempt = await TestAttempt.findOne({ 
            $or: [{ userId }, { ipAddress }],
            passed: false 
        });

        if (failedAttempt) {
            return res.status(403).json({ message: "This account or IP address is blocked from retaking the test." });
        }

        const questionIds = Object.keys(answers);
        if (questionIds.length === 0) {
            return res.status(400).json({ message: "No answers submitted." });
        }

        const correctQuestions = await Question.find({ _id: { $in: questionIds } });

        let score = 0;
        correctQuestions.forEach(question => {
            if (answers[question._id.toString()] === question.correctOptionIndex) {
                score++;
            }
        });

        const percentageScore = (score / correctQuestions.length) * 100;
        const passed = percentageScore >= 60;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        // This is the crucial step: Log every attempt to the database
        await TestAttempt.create({
            userId,
            ipAddress,
            domain: user.domain,
            score: percentageScore,
            passed,
        });

        if (passed) {
            user.testScore = percentageScore;
            user.testPassed = true;
            await user.save();
        }

        res.status(200).json({ success: true, passed, score: percentageScore });

    } catch (error) {
        console.error("Error in submitTest controller:", error);
        res.status(500).json({ message: "Server error submitting test" });
    }
};
