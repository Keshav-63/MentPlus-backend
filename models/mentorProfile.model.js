import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
    available: { type: Boolean, default: false },
    start: { type: String, default: '09:00' },
    end: { type: String, default: '17:00' },
}, { _id: false });

const mentorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Each user can only have one mentor profile
    },
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    hourlyRate: {
        type: Number,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    availability: {
        monday: availabilitySchema,
        tuesday: availabilitySchema,
        wednesday: availabilitySchema,
        thursday: availabilitySchema,
        friday: availabilitySchema,
        saturday: availabilitySchema,
        sunday: availabilitySchema,
    },
}, { timestamps: true });

export const MentorProfile = mongoose.model("MentorProfile", mentorProfileSchema);
