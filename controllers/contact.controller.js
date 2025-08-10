import { Contact } from "../models/contact.model.js";
import { sendContactFormNotification } from "../mailtrap/emails.js";

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // 1. Save the message to the database
        const newContactMessage = new Contact({
            name,
            email,
            subject,
            message,
        });
        await newContactMessage.save();

        // 2. Send an email notification to the admin
        // The admin's email is your EMAIL_USER from the .env file
        await sendContactFormNotification(process.env.EMAIL_USER, { name, email, subject, message });

        res.status(201).json({
            success: true,
            message: "Message sent successfully! We'll get back to you soon.",
        });

    } catch (error) {
        console.error("Error in submitContactForm controller:", error);
        res.status(500).json({ message: "Server error while submitting message." });
    }
};
