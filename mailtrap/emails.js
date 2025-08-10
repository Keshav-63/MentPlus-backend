import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE,
  CONTACT_FORM_NOTIFICATION_TEMPLATE,
} from "./emailTemplates.js";
import { transporter, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });

    console.log("Email sent successfully", info.messageId);
  } catch (error) {
    console.error(`Error sending verification email:`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

// Assuming you have a WELCOME_EMAIL_TEMPLATE similar to your others
export const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Welcome to our service!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });

    console.log("Welcome email sent successfully", info.messageId);
  } catch (error) {
    console.error(`Error sending welcome email:`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    console.log("Password reset email sent successfully", info.messageId);
  } catch (error) {
    console.error(`Error sending password reset email:`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Password reset email sent successfully", info.messageId);
  } catch (error) {
    console.error(`Error sending password reset success email:`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

// --- NEW FUNCTION FOR CONTACT NOTIFICATION ---
export const sendContactFormNotification = async (adminEmail, formData) => {
    try {
        let emailBody = CONTACT_FORM_NOTIFICATION_TEMPLATE;
        emailBody = emailBody.replace("{name}", formData.name);
        emailBody = emailBody.replace("{email}", formData.email);
        emailBody = emailBody.replace("{subject}", formData.subject);
        emailBody = emailBody.replace("{message}", formData.message);

        const info = await transporter.sendMail({
            from: sender,
            to: adminEmail, // Send the email to yourself (the admin)
            subject: `New Contact Message: ${formData.subject}`,
            html: emailBody,
        });

        console.log("Contact form notification sent successfully", info.messageId);
    } catch (error) {
        console.error(`Error sending contact form notification:`, error);
        // We don't throw an error here because the user's message was already saved.
        // The user should still see a success message.
    }
};