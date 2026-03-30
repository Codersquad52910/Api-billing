/**
 * Cron Job Service
 * 
 * Manages scheduled background tasks for the API Billing Platform.
 * Currently schedules the monthly usage report generation and
 * distribution via email.
 * 
 * All cron expressions follow the standard five-field format:
 * ┌───────────── minute (0–59)
 * │ ┌───────────── hour (0–23)
 * │ │ ┌───────────── day of month (1–31)
 * │ │ │ ┌───────────── month (1–12)
 * │ │ │ │ ┌───────────── day of week (0–7, 0 or 7 = Sunday)
 * │ │ │ │ │
 * * * * * *
 * 
 * @module services/cronService
 * @requires node-cron
 * @requires services/reportGenerator
 */

import cron from "node-cron";
import { generateAndSendReports } from "./reportGenerator.js";

/**
 * Initializes and starts all scheduled cron jobs.
 * 
 * Currently registered jobs:
 * - **Monthly Report** (0 0 1 * *): Generates and emails usage reports
 *   to all users on the 1st day of each month at midnight.
 * 
 * This function should be called once during application startup,
 * after the database connection has been established.
 * 
 * @function startCronJobs
 * @returns {void}
 */
export const startCronJobs = () => {
    // Run at 00:00 on the 1st day of every month
    cron.schedule("0 0 1 * *", () => {
        console.log("Running Monthly Report Job...");
        generateAndSendReports();
    });

    console.log("Cron Jobs Scheduled: Monthly Report (0 0 1 * *)");
};
