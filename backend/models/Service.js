/**
 * Service Model
 * 
 * Defines the schema for API services available on the billing platform.
 * Services represent the different APIs that users can subscribe to.
 * Each service has a base billing rate and can be toggled active/inactive
 * by administrators.
 * 
 * @module models/Service
 * @requires mongoose
 */

import mongoose from "mongoose";

/**
 * @typedef {Object} ServiceDocument
 * @property {string} name - Display name of the API service
 * @property {string} description - Detailed description of the service capabilities
 * @property {number} baseRate - Base cost per request in USD (default: $0.01)
 * @property {boolean} isActive - Whether the service is currently available
 * @property {Date} createdAt - Timestamp of service creation
 */

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    baseRate: { type: Number, required: true, default: 0.01 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Service", serviceSchema);
