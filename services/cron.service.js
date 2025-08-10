import cron from 'node-cron';
import { Booking } from '../models/booking.model.js';
import { Session } from '../models/session.model.js';
import { Transfer } from '../models/transfer.model.js';
import { Notification } from '../models/notification.model.js';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const completeSessionsAndProcessPayments = async () => {
    console.log('Running scheduled job: Checking for completed sessions...');
    const now = new Date();

    // 1. Find all 'approved' 1-on-1 bookings that need to be checked
    const approvedBookings = await Booking.find({ status: 'approved' });

    // 2. Find all 'upcoming' group sessions that need to be checked
    const upcomingGroupSessions = await Session.find({ status: 'upcoming' });
    
    // Combine both types into a single array to process them
    const allActiveSessions = [...approvedBookings, ...upcomingGroupSessions];

    for (const session of allActiveSessions) {
        // Determine the start time and duration for either a booking or a session
        const startTime = new Date(session.scheduledTime || session.dateTime);
        const duration = session.duration || session.sessionDetails?.duration || 60; // Default to 60 mins
        const endTime = new Date(startTime.getTime() + duration * 60000); // Calculate end time

        // THE CORE LOGIC: Check if the session's end time is in the past
        if (now > endTime) {
            try {
                // This is the crucial step. We update the main status field to 'completed'.
                session.status = 'completed';
                await session.save();
                console.log(`Session ${session._id} (type: ${session.constructor.modelName}) marked as completed.`);

                // --- Payment Release Logic for 1-on-1 Bookings ---
                // This block only runs if the session was a 'Booking'
                if (session.constructor.modelName === 'Booking') {
                    // In a real app, you would fetch the mentor's connected Razorpay account ID here.
                    const mentorAccountId = "acct_xxxxxxxxxxxxxx"; // Placeholder

                    // For now, we simulate the transfer to avoid real transactions in testing.
                    const transfer = {
                        id: `transfer_sim_${Date.now()}`,
                        status: 'processed',
                    };
                    
                    // Log the successful transfer in our database
                    await Transfer.create({
                        bookingId: session._id,
                        mentorId: session.mentorId,
                        amount: session.paymentDetails.mentorEarnings,
                        razorpayTransferId: transfer.id,
                        status: transfer.status,
                    });

                    // Notify the mentor that they have been paid
                    await Notification.create({
                        userId: session.mentorId,
                        message: `Your session is complete. ₹${(session.paymentDetails.mentorEarnings / 100).toFixed(2)} has been credited to your account.`,
                        link: '/mentor-dashboard'
                    });
                }

            } catch (error) {
                console.error(`Failed to process session ${session._id}:`, error);
            }
        }
    }
};

// This function is called from your main server file (index.js) to start the job
export const startSessionCompletionJob = () => {
    // Schedule the task to run every minute
    cron.schedule('* * * * *', completeSessionsAndProcessPayments);
    console.log('Session completion job started. Will run every minute.');
};
