/**
 * API Usage Tracking Middleware
 * 
 * Intercepts incoming API requests, validates the provided API key,
 * and records granular usage metrics including geographic location data.
 * 
 * Usage records are aggregated by API key, date, country, and region
 * to enable detailed analytics and accurate billing calculations.
 * 
 * Flow:
 * 1. Extract API key from x-api-key header
 * 2. Validate key exists and is active
 * 3. Resolve client IP to geographic location
 * 4. Upsert usage record for the key+date+region combination
 * 5. Pass control to the next middleware/handler
 * 
 * @module middleware/apiMiddleware
 * @requires models/APIKey
 * @requires models/Usage
 * @requires geoip-lite
 * @requires request-ip
 */

import APIKey from "../models/APIKey.js";
import Usage from "../models/Usage.js";
import geoip from "geoip-lite";
import requestIp from "request-ip";

/**
 * Tracks API usage per request with geographic granularity.
 * 
 * Validates the API key from the `x-api-key` request header,
 * resolves the client's geographic location via IP lookup,
 * and increments the usage counter for the corresponding
 * key+date+country+region combination.
 * 
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 * 
 * @example
 * // Apply to specific routes that require API key tracking
 * router.get("/data", trackUsage, dataHandler);
 */
export const trackUsage = async (req, res, next) => {
    const key = req.headers["x-api-key"];
    if (!key) return res.status(401).json({ message: "API Key required" });

    const apiKeyDoc = await APIKey.findOne({ key, isActive: true });
    if (!apiKeyDoc) return res.status(403).json({ message: "Invalid API Key" });

    // ─── Geolocation Resolution ──────────────────────────────────────────
    const clientIp = requestIp.getClientIp(req);
    const geo = geoip.lookup(clientIp) || {};
    const country = geo.country || "Unknown";
    const region = geo.region || "Unknown";

    // ─── Daily Usage Aggregation ─────────────────────────────────────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert usage record grouped by key + date + country + region
    // This enables granular geographic analytics while maintaining
    // efficient document-level aggregation
    const usage = await Usage.findOne({ apiKey: apiKeyDoc._id, date: today, country, region });

    if (usage) {
        usage.count++;
        await usage.save();
    } else {
        await Usage.create({ apiKey: apiKeyDoc._id, date: today, count: 1, country, region });
    }

    next();
};
