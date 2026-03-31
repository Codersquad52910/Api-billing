/**
 * API Key Model
 * 
 * Defines the schema for API keys in the billing platform.
 * Each key is a unique 256-bit hex string associated with a user account.
 * Keys can be activated/deactivated and carry an individual billing rate
 * that determines the cost per API request.
 * 
 * @module models/APIKey
 * @requires mongoose
 */

import mongoose from "mongoose";

/**
 * @typedef {Object} APIKeyDocument
 * @property {string} key - Unique 256-bit hex API key string
 * @property {ObjectId} [user] - Reference to the owning User document
 * @property {Date} createdAt - Timestamp of key generation
 * @property {boolean} isActive - Whether the key is currently active for use
 * @property {number} rate - Cost per API request in USD (default: $0.01)
 */

const apiKeySchema = new mongoose.Schema({
    key: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    rate: { type: Number, default: 0.01 }, // Cost per request in $
});



export default mongoose.model("APIKey", apiKeySchema);
