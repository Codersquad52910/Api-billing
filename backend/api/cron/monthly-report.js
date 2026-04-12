/**
 * Vercel Cron Job — Monthly Report Generator
 * 
 * This serverless function is invoked by Vercel Cron Jobs on the
 * 1st of each month. It generates and emails usage reports to all users.
 * 
 * Protected by CRON_SECRET to prevent unauthorized invocations.
 * 
 * @module api/cron/monthly-report
 */

import dotenv from "dotenv";
dotenv.config();

import connectDB from "../../config/db.js";
import { generateAndSendReports } from "../../services/reportGenerator.js";

export default async function handler(req, res) {
  // Verify the request is from Vercel Cron (or has the correct secret)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await connectDB();
    await generateAndSendReports();
    res.json({ success: true, message: "Monthly reports generated and sent" });
  } catch (error) {
    console.error("Cron Job Error:", error);
    res.status(500).json({ error: "Failed to generate reports" });
  }
}
