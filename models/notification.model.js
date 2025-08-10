import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    link: { // Optional: A link to navigate to when the notification is clicked
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
