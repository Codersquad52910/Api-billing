/**
 * Application-wide constants for the API Billing Platform.
 * 
 * Centralizes magic numbers, string literals, and configuration defaults
 * to improve maintainability and reduce duplication across the codebase.
 * 
 * @module utils/constants
 * @author API Billing Team
 * @version 1.0.0
 */

// ─── User Role Definitions ──────────────────────────────────────────────────────
export const USER_ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
});

// ─── HTTP Status Codes (commonly used across routes) ─────────────────────────
export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

// ─── Authentication Constants ────────────────────────────────────────────────────
export const AUTH_CONSTANTS = Object.freeze({
  SALT_ROUNDS: 10,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  TOKEN_HEADER_PREFIX: "Bearer",
});

// ─── API Billing Defaults ────────────────────────────────────────────────────────
export const BILLING_DEFAULTS = Object.freeze({
  DEFAULT_RATE_PER_REQUEST: 0.01, // USD per API call
  CURRENCY: "USD",
  DECIMAL_PRECISION: 2,
});

// ─── Cron Schedule Expressions ───────────────────────────────────────────────────
export const CRON_SCHEDULES = Object.freeze({
  MONTHLY_FIRST_DAY: "0 0 1 * *", // Run at midnight on the 1st of every month
});

// ─── Geolocation Defaults ────────────────────────────────────────────────────────
export const GEO_DEFAULTS = Object.freeze({
  UNKNOWN_COUNTRY: "Unknown",
  UNKNOWN_REGION: "Unknown",
});

// ─── Response Messages ──────────────────────────────────────────────────────────
export const RESPONSE_MESSAGES = Object.freeze({
  // Auth
  AUTH_NO_TOKEN: "No token",
  AUTH_INVALID_TOKEN: "Invalid Token",
  AUTH_FORBIDDEN: "Forbidden",
  AUTH_EMAIL_IN_USE: "Email already in use",
  AUTH_USER_NOT_FOUND: "User not found",
  AUTH_WRONG_PASSWORD: "Wrong password",
  AUTH_REGISTRATION_SUCCESS: "Registration successful.",
  AUTH_EMAIL_VERIFIED: "Email verified successfully.",
  AUTH_ALREADY_VERIFIED: "Email already verified.",
  AUTH_INVALID_OTP: "Invalid or expired OTP.",
  AUTH_OTP_SENT: "OTP sent successfully",
  AUTH_PASSWORD_RESET: "Password reset successful. You can now login.",
  AUTH_OTP_SENT_EMAIL: "OTP sent to your email.",

  // Admin
  ADMIN_NOT_AUTHORIZED: "Not authorized as admin",
  ADMIN_SUPER_NOT_AUTHORIZED: "Not authorized as super admin",
  ADMIN_CREATED: "Admin created",
  
  // API Keys
  KEY_NOT_FOUND: "Key not found",
  KEY_DELETED: "Key deleted",
  KEY_RATE_UPDATED: "Rate updated",
  API_KEY_REQUIRED: "API Key required",
  API_KEY_INVALID: "Invalid API Key",

  // Services
  SERVICE_NOT_FOUND: "Service not found",
  SERVICE_DELETED: "Service deleted",
  SERVICE_MISSING_FIELDS: "Please provide all fields",
  SERVICE_ALREADY_SUBSCRIBED: "Already subscribed to this service",

  // General
  SERVER_ERROR: "Server Error",
  HEALTH_CHECK: "API Billing Backend is running",
});

// ─── Email Templates ─────────────────────────────────────────────────────────────
export const EMAIL_SUBJECTS = Object.freeze({
  VERIFY_EMAIL: "Verify your email",
  RESET_PASSWORD: "Reset your password",
  MONTHLY_REPORT: "Monthly API Usage Report",
});
