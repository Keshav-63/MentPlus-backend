import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    passed: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true });

export const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);