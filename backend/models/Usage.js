/**
 * Usage Model
 * 
 * Tracks API usage metrics on a per-key, per-day, per-region basis.
 * Each document represents the aggregated request count for a specific
 * API key on a given date from a particular geographic region.
 * 
 * This granular tracking enables detailed analytics including:
 * - Daily usage trends per API key
 * - Geographic distribution of API traffic
 * - Revenue calculation based on usage × rate
 * 
 * @module models/Usage
 * @requires mongoose
 */

import mongoose from "mongoose";

/**
 * @typedef {Object} UsageDocument
 * @property {ObjectId} apiKey - Reference to the associated APIKey document
 * @property {Date} date - The date of the usage record (normalized to start of day)
 * @property {number} count - Number of API requests made on this date
 * @property {string} country - ISO country code or "Unknown" for unresolved IPs
 * @property {string} region - Geographic region or "Unknown" for unresolved IPs
 */

const usageSchema = new mongoose.Schema({
    apiKey: { type: mongoose.Schema.Types.ObjectId, ref: "APIKey", required: true },
    date: { type: Date, default: Date.now }, // Normalized to start of day for daily aggregation
    count: { type: Number, default: 0 },
    country: { type: String, default: "Unknown" },
    region: { type: String, default: "Unknown" },
});

export default mongoose.model("Usage", usageSchema);
