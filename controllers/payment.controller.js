import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Booking } from '../models/booking.model.js';
import { User } from '../models/user.model.js';
import { MentorProfile } from '../models/mentorProfile.model.js';
import { Notification } from '../models/notification.model.js';
import { Session } from '../models/session.model.js';

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Student requests a session -> Create a Razorpay Order
export const createBookingOrder = async (req, res) => {
    try {
        const { mentorId, requestedDateTime } = req.body; // <<< Receive requestedDateTime
        const studentId = req.userId;

        const mentorProfile = await MentorProfile.findOne({ userId: mentorId });
        if (!mentorProfile) {
            return res.status(404).json({ message: "Mentor profile not found." });
        }

        const hourlyRate = mentorProfile.hourlyRate;
        const platformFee = hourlyRate * 0.05; // 5% platform fee
        const totalAmount = hourlyRate + platformFee;
        const amountInPaise = Math.round(totalAmount * 100); // Convert to smallest currency unit (paise for INR)

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_booking_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Create a booking record in our database with 'pending_payment' status
        const newBooking = new Booking({
            studentId,
            mentorId,
            requestedDateTime,
            paymentDetails: {
                orderId: order.id,
                amount: amountInPaise,
                platformFee: Math.round(platformFee * 100),
                mentorEarnings: Math.round(hourlyRate * 100),
                currency: 'INR',
            }
        });
        await newBooking.save();

res.status(200).json({ success: true, order, bookingId: newBooking._id });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Server error while creating order." });
    }
};

// 2. Frontend sends payment details -> Verify Payment Signature
export const verifyPayment = async (req, res) => {
    try {
        console.log("Verifying payment with data:", req.body);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
     
        const studentId = req.userId;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is authentic, update the booking in the database
            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ message: "Booking not found." });

            booking.paymentDetails.paymentId = razorpay_payment_id;
            booking.paymentDetails.signature = razorpay_signature;
            booking.paymentDetails.status = 'captured';
            booking.status = 'pending_approval'; // Now it's waiting for the mentor to approve
            await booking.save();

        // --- NEW: CREATE NOTIFICATION FOR MENTOR ---
        const student = await User.findById(studentId);
        await Notification.create({
            userId: booking.mentorId,
            message: `You have a new 1-on-1 session request from ${student.name}.`,
            link: '/mentor-dashboard' // Link to the page where they can take action
        });
        // --- END OF NEW CODE ---
            // TODO: Send a notification to the mentor about the new request

            res.status(200).json({ success: true, message: "Payment successful! Your request has been sent to the mentor." });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Server error while verifying payment." });
    }
};

// 3. Mentor fetches their booking requests
export const getMentorBookings = async (req, res) => {
    try {
        const mentorId = req.userId;
        const bookings = await Booking.find({ mentorId, status: 'pending_approval' })
            .populate('studentId', 'name email') // Populate student's name and email
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching mentor bookings:", error);
        res.status(500).json({ message: "Server error fetching bookings." });
    }
};
// --- Group Session Booking Order ---
export const createGroupSessionOrder = async (req, res) => {
    try {
        console.log("Creating group session order with data:", req.body);
        const { sessionId } = req.body;
        const studentId = req.userId;
        const session = await Session.findById(sessionId);
        console.log("Session found:", session);
        if (!session) return res.status(404).json({ message: "Group session not found." });
        if (session.participants.length >= session.maxParticipants) return res.status(400).json({ message: "This session is full." });
        if (session.participants.includes(studentId)) return res.status(400).json({ message: "You are already registered." });

        const amountInPaise = 10 * 100; // Fixed ₹10 price
        const options = { amount: amountInPaise, currency: "INR", receipt: `receipt_group_${Date.now()}` };
        const order = await razorpay.orders.create(options);
        console.log("Razorpay order created:", order);
        const newBooking = new Booking({
            studentId,
            mentorId: session.mentorId,
            sessionId: session._id,
            sessionDetails: { title: `Group Session: ${session.title}`, duration: session.duration },
            status: 'pending_payment',
            paymentDetails: {
                orderId: order.id,
                amount: amountInPaise,
                platformFee: Math.round(amountInPaise * 0.05),
                mentorEarnings: Math.round(amountInPaise * 0.95),
            }
        });
        console.log("New booking created:", newBooking);
        await newBooking.save();
        res.status(200).json({ success: true, order, bookingId: newBooking._id });
    } catch (error) {
        res.status(500).json({ message: "Server error creating group session order." });
    }
};

// --- Group Session Payment Verification ---
export const verifyGroupSessionPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        const studentId = req.userId;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
        
        if (expectedSignature === razorpay_signature) {
            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ message: "Booking record not found." });

            booking.paymentDetails.paymentId = razorpay_payment_id;
            booking.paymentDetails.signature = razorpay_signature;
            booking.paymentDetails.status = 'captured';
            booking.status = 'approved';
            await booking.save();

            await Session.findByIdAndUpdate(booking.sessionId, { $addToSet: { participants: studentId } });

            await Notification.create({
                userId: studentId,
                message: `You have successfully joined the group session: "${booking.sessionDetails.title}".`,
                link: '/student-dashboard'
            });

            res.status(200).json({ success: true, message: "Successfully joined the group session!" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error verifying group payment." });
    }
};