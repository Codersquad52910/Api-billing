/**
 * Report Generator Service
 * 
 * Generates and distributes monthly API usage reports to all
 * registered users. Reports include aggregated metrics such as
 * total request count and billing summary for the previous month.
 * 
 * This service is invoked by the cron scheduler on the 1st of
 * each month and iterates through all user accounts to compile
 * personalized HTML reports.
 * 
 * Report Contents:
 * - Reporting period (previous calendar month)
 * - Total API requests made
 * - Total cost based on per-key rates
 * - Delivered via the email service
 * 
 * @module services/reportGenerator
 * @requires models/User
 * @requires models/APIKey
 * @requires models/Usage
 * @requires services/emailService
 */

import User from "../models/User.js";
import APIKey from "../models/APIKey.js";
import Usage from "../models/Usage.js";
import { sendEmail } from "./emailService.js";

/**
 * Generates and sends monthly usage reports to all users.
 * 
 * Iterates through every registered user, compiles their
 * usage statistics for the previous calendar month, and
 * sends a formatted HTML report via email.
 * 
 * @async
 * @function generateAndSendReports
 * @returns {Promise<void>}
 */
export const generateAndSendReports = async () => {
    console.log("Starting Monthly Report Generation...");
    const users = await User.find();

    for (const user of users) {
        await sendUserReport(user);
    }
    console.log("Monthly Reporting Complete.");
};

/**
 * Compiles and sends a usage report for a single user.
 * 
 * Calculates the reporting period as the previous full calendar month,
 * aggregates all usage records across the user's API keys, and
 * generates a formatted HTML email with the summary.
 * 
 * @async
 * @function sendUserReport
 * @param {import('mongoose').Document} user - The User document to generate the report for
 * @returns {Promise<void>}
 * @private
 */
const sendUserReport = async (user) => {
    const keys = await APIKey.find({ user: user._id });
    const keyIds = keys.map(k => k._id);

    // ─── Calculate Reporting Period ──────────────────────────────────────
    const startOfMonth = new Date();
    startOfMonth.setMonth(startOfMonth.getMonth() - 1);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setDate(0); // Last day of previous month
    endOfMonth.setHours(23, 59, 59, 999);

    // ─── Aggregate Usage Data ────────────────────────────────────────────
    const usage = await Usage.find({
        apiKey: { $in: keyIds },
        date: { $gte: startOfMonth, $lte: endOfMonth }
    }).populate("apiKey");

    let totalRequests = 0;
    let totalCost = 0;

    usage.forEach(u => {
        totalRequests += u.count;
        totalCost += u.count * (u.apiKey.rate || 0.01);
    });

    // ─── Generate HTML Report ────────────────────────────────────────────
    const html = `
        <h1>Monthly Usage Report</h1>
        <p>Hello ${user.name},</p>
        <p>Here is your API usage report for ${startOfMonth.toLocaleDateString()} - ${endOfMonth.toLocaleDateString()}.</p>
        
        <h2>Summary</h2>
        <ul>
            <li><strong>Total Requests:</strong> ${totalRequests}</li>
            <li><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</li>
        </ul>
        
        <p>Thank you for using ApiBill!</p>
    `;

    await sendEmail(user.email, "Monthly API Usage Report", html);
};
