/**
 * API Billing Platform — Application Entry Point
 * 
 * Bootstraps the Express.js server with middleware configuration,
 * route registration, database connection, and background service
 * initialization.
 * 
 * Startup Sequence:
 * 1. Load environment variables from .env
 * 2. Establish MongoDB connection
 * 3. Configure CORS and JSON parsing middleware
 * 4. Register API route handlers
 * 5. Initialize scheduled background jobs
 * 6. Start HTTP server on configured port
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

// ─── Environment & Database Initialization ───────────────────────────────────
dotenv.config();
connectDB();

// ─── Express Application Setup ───────────────────────────────────────────────
const app = express();

// ─── CORS Configuration ──────────────────────────────────────────────────────
// Allow requests from both frontend dev servers (user & admin panels)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175", "http://127.0.0.1:5176"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ─── Body Parsing Middleware ─────────────────────────────────────────────────
app.use(express.json());

// ─── API Route Registration ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/keys", apiRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);

// ─── Health Check Endpoint ──────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API Billing Backend is running");
});

// ─── Background Services ────────────────────────────────────────────────────
startCronJobs();

// ─── Server Startup ─────────────────────────────────────────────────────────
app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
