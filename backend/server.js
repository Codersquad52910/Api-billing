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
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import usageRoutes from "./routes/usageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import gatewayRoutes from "./routes/gatewayRoutes.js";
import { startCronJobs } from "./services/cronService.js";

// ─── Path Resolution ────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Environment & Database Initialization ───────────────────────────────────
dotenv.config();
connectDB();

// ─── Express Application Setup ───────────────────────────────────────────────
const app = express();

// ─── CORS Configuration ──────────────────────────────────────────────────────
// Allow requests from both frontend dev servers (user & admin panels)
// and from same-origin in production (Docker)
app.use(cors({
  origin: [
    "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176",
    "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175", "http://127.0.0.1:5176",
    "http://localhost:5000", "http://127.0.0.1:5000",
    "https://api-billing-user.vercel.app",
    "https://api-billing-admin.vercel.app",
    /\.vercel\.app$/ // This allows ANY of your Vercel subdomains
  ],
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
app.use("/api/notifications", notificationRoutes);
app.use("/api/gateway", gatewayRoutes);

// ─── Health Check Endpoint ──────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API Billing Backend is running", timestamp: new Date().toISOString() });
});

// ─── Static File Serving (Production / Docker) ──────────────────────────────
// In Docker, the built React frontends are available as static files.
// User Frontend:  http://localhost:5000/
// Admin Frontend: http://localhost:5000/admin/
const frontendDist = join(__dirname, "..", "frontend", "dist");
const adminDist = join(__dirname, "..", "admin-frontend", "dist");

if (existsSync(frontendDist)) {
  console.log("📦 Serving User Frontend from:", frontendDist);
  // Serve admin frontend at /admin (must come BEFORE the main frontend catch-all)
  if (existsSync(adminDist)) {
    console.log("📦 Serving Admin Frontend from:", adminDist);
    app.use("/admin", express.static(adminDist));
    // SPA fallback — only serve index.html for routes that don't match actual files
    app.get("/admin/*", (req, res, next) => {
      // If the request looks like a file (has extension), let it 404 naturally
      if (req.path.match(/\.\w+$/)) {
        return next();
      }
      res.sendFile(join(adminDist, "index.html"));
    });
  }
  // Serve user frontend at root
  app.use(express.static(frontendDist));
  app.get("*", (req, res) => {
    res.sendFile(join(frontendDist, "index.html"));
  });
} else {
  // Local development — just show a health message
  app.get("/", (req, res) => {
    res.send("API Billing Backend is running. Frontends are served by Vite dev servers.");
  });
}

// ─── Background Services ────────────────────────────────────────────────────
startCronJobs();

// ─── Server Startup ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 5000, () =>
    console.log("Server running on port " + (process.env.PORT || 5000))
  );
}

export default app;
