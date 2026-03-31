/**
 * Email Service
 * 
 * Provides email delivery capabilities for the API Billing Platform.
 * Supports transactional emails including OTP verification, password
 * resets, and monthly usage reports.
 * 
 * When SMTP credentials are not configured (development mode),
 * emails are logged to the console instead of being sent.
 * 
 * @module services/emailService
 * @requires nodemailer
 * @requires dotenv
 */

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Nodemailer transport instance configured with Gmail SMTP.
 * 
 * Uses the following environment variables:
 * - SMTP_EMAIL: The sender email address
 * - SMTP_PASSWORD: The app-specific password for SMTP authentication
 * 
 * @type {import('nodemailer').Transporter}
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Sends an email using the configured SMTP transport.
 * 
 * In development mode (when SMTP credentials are not set),
 * the email content is logged to the console instead of
 * being sent over the network.
 * 
 * @async
 * @function sendEmail
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - HTML content of the email body
 * @returns {Promise<void>}
 * 
 * @example
 * await sendEmail("user@example.com", "Welcome!", "<h1>Hello!</h1>");
 */
export const sendEmail = async (to, subject, html) => {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log("Mock Email Sent:");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${html}`);
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
