/**
 * API Billing Platform — Application Entry Point
 * 
 * Bootstraps the Express.js server with middleware configuration,
 * route registration, database connection, and background service
 * initialization.
 * 
 * Supports both traditional Node.js server mode and Vercel
 * serverless deployment (via api/index.js).
 * 
 * @module server
 * @requires express
 * @requires cors
 * @requires dotenv
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import usageRoutes from "./routes/usageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import { startCronJobs } from "./services/cronService.js";

// ─── Environment Initialization ──────────────────────────────────────────────
dotenv.config();
connectDB();

// ─── Express Application Setup ──────────────────────────────────────────────
const app = express();

// ─── CORS Configuration ─────────────────────────────────────────────────────
// Allow requests from local dev servers and production Vercel URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
];

// Add production URLs from environment variables
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
if (process.env.ADMIN_URL) allowedOrigins.push(process.env.ADMIN_URL);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ─── Body Parsing Middleware ────────────────────────────────────────────────
app.use(express.json());

// ─── API Route Registration ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/keys", apiRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);

// ─── Health Check Endpoint ──────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API Billing Backend is running", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("API Billing Backend is running.");
});

// ─── Background Services ───────────────────────────────────────────────────
startCronJobs();

// ─── Server Startup (Local / Non-Vercel only) ──────────────────────────────
// In Vercel, the app is exported and served as a serverless function,
// so we skip app.listen().
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log("Server running on port " + PORT)
  );
}

// ─── Export for Vercel Serverless ───────────────────────────────────────────
export default app;
