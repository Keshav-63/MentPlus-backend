import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: { // Amount in the smallest currency unit (paise)
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: 'INR',
    },
    razorpayTransferId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const Transfer = mongoose.model("Transfer", transferSchema);
