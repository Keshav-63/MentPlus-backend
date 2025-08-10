import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
    },
    subject: {
        type: String,
        required: [true, "Subject is required."],
    },
    message: {
        type: String,
        required: [true, "Message is required."],
    },
    status: {
        type: String,
        enum: ['new', 'read', 'archived'],
        default: 'new',
    }
}, { timestamps: true });

export const Contact = mongoose.model("Contact", contactSchema);
