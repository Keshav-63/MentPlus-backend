import { generateToken04 } from 'zego-token'; // CORRECTED import from the official 'zego-token' package

export const generateZegoToken = (userId, roomId) => {
    try {
        const appID = parseInt(process.env.ZEGO_APP_ID);
        const serverSecret = process.env.ZEGO_SERVER_SECRET;

        // --- DEBUGGING LOGS ---
        console.log('--- Attempting to Generate Zego Token ---');
        console.log('App ID from .env:', process.env.ZEGO_APP_ID, '(Parsed as Integer:', appID, ')');
        console.log('Server Secret Loaded:', !!serverSecret); // This will be true if the secret is loaded, false otherwise
        console.log('User ID received:', userId);
        console.log('Room ID received:', roomId);
        // --- END DEBUGGING LOGS ---
        
        if (!appID || !serverSecret) {
            throw new Error('ZegoCloud App ID or Server Secret is not configured correctly in the .env file.');
        }

        const effectiveTimeInSeconds = 3600; // Token is valid for 1 hour

        const payload = {
            room_id: roomId,
            privilege: {
                1: 1, // loginRoom: permission to log in to a room (required)
                2: 1, // publishStream: permission to publish streams (required for a host)
            },
            stream_id_list: null // No specific stream restrictions
        };

        const userIdStr = userId.toString();

        const token = generateToken04(
            appID,
            userIdStr,
            serverSecret,
            effectiveTimeInSeconds,
            JSON.stringify(payload)
        );
        
        console.log('--- Zego Token Generated Successfully ---');
        return token;

    } catch (error) {
        console.error("!!! Critical Error in generateZegoToken !!!:", error);
        throw error;
    }
};
