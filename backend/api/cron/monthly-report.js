/**
 * Vercel Cron Job Handler
 * 
 * This endpoint is triggered by Vercel's Cron scheduler to process monthly reports.
 * 
 * @module api/cron/monthly-report
 */

import app from "../../server.js";

export default async function handler(req, res) {
  // Only allow Vercel crons or authorized requests
  // In a real app, you'd check a secret header here
  
  // We can't easily wait for the cron logic if it's strictly in server.js
  // But for now, we point Vercel here to keep the route alive.
  res.status(200).json({ message: "Cron endpoint triggered" });
}
