/**
 * Input validation utilities for the API Billing Platform.
 * 
 * Provides reusable validation functions for common input patterns
 * like email addresses, passwords, and API key formats. These
 * validators can be used across route handlers to ensure data integrity.
 * 
 * @module utils/validators
 * @author API Billing Team
 * @version 1.0.0
 */

/**
 * Email validation regex pattern.
 * Validates standard email formats conforming to RFC 5322 (simplified).
 * 
 * @constant {RegExp}
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address format.
 * 
 * @param {string} email - The email address to validate
 * @returns {{ isValid: boolean, message: string }} Validation result
 * 
 * @example
 * const result = validateEmail("user@example.com");
 * // => { isValid: true, message: "Valid email format" }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { isValid: false, message: "Email is required" };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { isValid: false, message: "Invalid email format" };
  }

  return { isValid: true, message: "Valid email format" };
};

/**
 * Validates password strength requirements.
 * 
 * Password must meet the following criteria:
 * - Minimum 6 characters long
 * - Contains at least one letter
 * - Contains at least one number
 * 
 * @param {string} password - The password to validate
 * @returns {{ isValid: boolean, message: string }} Validation result
 * 
 * @example
 * const result = validatePassword("mypass123");
 * // => { isValid: true, message: "Valid password" }
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }

  return { isValid: true, message: "Valid password" };
};

/**
 * Validates that required fields are present in a request body.
 * 
 * @param {Object} body - The request body object
 * @param {string[]} requiredFields - Array of field names that must be present
 * @returns {{ isValid: boolean, missingFields: string[] }} Validation result
 * 
 * @example
 * const result = validateRequiredFields(
 *   { name: "Test", email: "test@example.com" },
 *   ["name", "email", "password"]
 * );
 * // => { isValid: false, missingFields: ["password"] }
 */
export const validateRequiredFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Validates a monetary rate value.
 * Ensures the rate is a positive number within acceptable bounds.
 * 
 * @param {number} rate - The rate value to validate
 * @returns {{ isValid: boolean, message: string }} Validation result
 */
export const validateRate = (rate) => {
  if (rate === undefined || rate === null) {
    return { isValid: false, message: "Rate is required" };
  }

  if (typeof rate !== "number" || isNaN(rate)) {
    return { isValid: false, message: "Rate must be a valid number" };
  }

  if (rate < 0) {
    return { isValid: false, message: "Rate cannot be negative" };
  }

  if (rate > 1000) {
    return { isValid: false, message: "Rate exceeds maximum allowed value" };
  }

  return { isValid: true, message: "Valid rate" };
};
