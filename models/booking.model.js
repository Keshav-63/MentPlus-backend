import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // --- NEW FIELD ---
    // For group sessions, this will link to the Session document.
    // For 1-on-1 sessions, this can be null.
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        default: null,
    },
    // --- END ---
    sessionDetails: {
        title: { type: String, default: "1-on-1 Mentorship Session" },
        duration: { type: Number, default: 60 },
    },
    status: {
        type: String,
        enum: ['pending_payment', 'pending_approval', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending_payment',
    },
    requestedDateTime: { type: Date },
    scheduledTime: { type: Date },
    roomId: { type: String },
    paymentDetails: {
        orderId: { type: String },
        paymentId: { type: String },
        signature: { type: String },
        amount: { type: Number },
        platformFee: { type: Number },
        mentorEarnings: { type: Number },
        currency: { type: String, default: 'INR' },
        status: { type: String, enum: ['created', 'captured', 'failed', 'refunded'], default: 'created' },
    },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);
