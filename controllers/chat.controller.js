import { Booking } from '../models/booking.model.js';
import { User } from '../models/user.model.js';
import { generateToken04 } from '../utils/tokenGenerator.js'; // Adjust path as needed

/**
 * Get chat connections for current user
 */
export const getChatConnections = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ message: 'User not found.' });

    const completedBookings = await Booking.find({
      status: { $in: ['completed', 'approved'] },
      $or: [{ studentId: currentUserId }, { mentorId: currentUserId }],
    })
      .populate('studentId', 'name role')
      .populate('mentorId', 'name role');

    const connectionsMap = new Map();
    completedBookings.forEach((booking) => {
      const otherUser = currentUser.role === 'student' ? booking.mentorId : booking.studentId;

      if (!connectionsMap.has(otherUser._id.toString())) {
        connectionsMap.set(otherUser._id.toString(), {
          userID: otherUser._id.toString(),
          userName: otherUser.name,
          avatar: '', // Add avatar if available
        });
      }
    });
console.log('Chat connections:', Array.from(connectionsMap.values()));
    res.status(200).json({
      success: true,
      connections: Array.from(connectionsMap.values()),
    });
  } catch (error) {
    console.error('Error fetching chat connections:', error);
    res.status(500).json({ message: 'Server error while fetching chat connections.' });
  }
};

/**
 * Generate ZIM Token for chat using official generateToken04
 */
export const generateZimToken = async (req, res) => {
  try {
    console.log('Generating ZIM token for user:', req.userId);
    const userId = req.userId; // from auth middleware
    const appID = parseInt(process.env.VITE_ZEGO_APP_ID_CHAT, 10);
    const serverSecret = process.env.VITE_ZEGO_SERVER_SECRET_CHAT;
    console.log('Generating ZIM token for user:', userId);

    if (!userId || !appID || !serverSecret) {
        console.error('Missing Zego credentials or user ID');
      return res.status(400).json({ message: 'Missing Zego credentials or user ID' });
    }
    

    const effectiveTimeInSeconds = 12 * 60 * 60; // 12 hours
    const token = generateToken04(appID, userId.toString(), serverSecret, effectiveTimeInSeconds);
    console.log('Generated ZIM token:', token);
    res.status(200).json({
      success: true,
      token,
      expireAt: Date.now() + effectiveTimeInSeconds * 1000,
    });
  } catch (error) {
    console.error('Error generating ZIM token:', error);
    res.status(500).json({ message: 'Server error while generating ZIM token.' });
  }
};
