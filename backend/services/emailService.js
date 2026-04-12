import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configure the transporter using Gmail's official SMTP settings.
 * SSL is used on port 465 for better reliability.
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Sends a real email to the recipient.
 * 
 * @async
 * @function sendEmail
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email content
 * @throws {Error} If the email fails to send due to SMTP credentials or network issues.
 */
export const sendEmail = async (to, subject, html) => {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        throw new Error("SMTP credentials are not configured in environment variables.");
    }

    try {
        await transporter.sendMail({
            from: `"API Billing Platform" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log(`[Email Service] Success: Sent to ${to}`);
        return true;
    } catch (error) {
        console.error(`[Email Service] Critical Failure: ${error.message}`);
        // Throw the error so the calling route knows to handle the failure
        throw new Error(`Email delivery failed: ${error.message}. Check your SMTP credentials.`);
    }
};
