import mongoose from "mongoose";
import { randomUUID } from "crypto";

const sessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    domain: {
        type: String,
        required: true,
        enum: ['programming', 'aiml', 'cybersecurity', 'dsa', 'blockchain'],
    },
    dateTime: {
        type: Date,
        required: true,
    },
    duration: { // Duration in minutes
        type: Number,
        required: true,
    },
    maxParticipants: {
        type: Number,
        required: true,
    },
    pricePerStudent: {
        type: Number,
        required: true,
    },
    sessionType: {
        type: String,
        default: 'group',
        enum: ['one-on-one', 'group'],
    },
    // This will be used for the ZegoCloud video call room
    roomId: {
        type: String,
        default: () => randomUUID(),
        unique: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        default: 'upcoming',
        enum: ['upcoming', 'live', 'completed', 'cancelled'],
    }
}, { timestamps: true });

export const Session = mongoose.model("Session", sessionSchema);
