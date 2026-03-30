/**
 * User Model
 * 
 * Defines the schema for user accounts in the API Billing Platform.
 * Supports three role types: regular users, administrators, and
 * super administrators. Includes fields for email verification
 * via OTP and service subscription tracking.
 * 
 * @module models/User
 * @requires mongoose
 */

import mongoose from "mongoose";

/**
 * @typedef {Object} UserDocument
 * @property {string} name - User's display name
 * @property {string} email - User's unique email address (used for authentication)
 * @property {string} password - Bcrypt-hashed password
 * @property {('user'|'admin'|'super_admin')} role - Authorization level
 * @property {boolean} isVerified - Whether the user's email has been verified
 * @property {string} [otp] - Temporary one-time password for email verification
 * @property {Date} [otpExpires] - Expiration timestamp for the current OTP
 * @property {ObjectId[]} subscribedServices - References to subscribed Service documents
 * @property {Date} createdAt - Timestamp of account creation (auto-managed)
 * @property {Date} updatedAt - Timestamp of last update (auto-managed)
 */

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin", "super_admin"],
    default: "user"
  },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  subscribedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
