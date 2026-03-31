/**
 * Centralized logging utility for the API Billing Platform.
 * 
 * Provides structured logging with severity levels, timestamps,
 * and contextual metadata for better observability and debugging.
 * 
 * In production, this can be extended to integrate with external
 * logging services (e.g., Datadog, CloudWatch, Sentry).
 * 
 * @module utils/logger
 * @author API Billing Team
 * @version 1.0.0
 */

const LOG_LEVELS = Object.freeze({
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
});

/**
 * Formats a log message with ISO timestamp and severity level.
 * 
 * @param {string} level - The severity level of the log
 * @param {string} context - The module or function originating the log
 * @param {string} message - The human-readable log message
 * @returns {string} Formatted log string
 */
const formatMessage = (level, context, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] [${context}] ${message}`;
};

/**
 * Logger instance with leveled logging methods.
 * Each method accepts a context string (typically the module name)
 * and the log message.
 */
const logger = {
  /**
   * Logs debug-level messages. Used for development diagnostics.
   * @param {string} context - The originating module or function
   * @param {string} message - Debug information
   */
  debug: (context, message) => {
    console.log(formatMessage(LOG_LEVELS.DEBUG, context, message));
  },

  /**
   * Logs informational messages. Used for routine operational events.
   * @param {string} context - The originating module or function
   * @param {string} message - Informational message
   */
  info: (context, message) => {
    console.log(formatMessage(LOG_LEVELS.INFO, context, message));
  },

  /**
   * Logs warning messages. Used for recoverable issues or deprecations.
   * @param {string} context - The originating module or function
   * @param {string} message - Warning description
   */
  warn: (context, message) => {
    console.warn(formatMessage(LOG_LEVELS.WARN, context, message));
  },

  /**
   * Logs error messages. Used for failures and exceptions.
   * @param {string} context - The originating module or function
   * @param {string} message - Error description
   * @param {Error} [error] - Optional Error object for stack trace
   */
  error: (context, message, error = null) => {
    console.error(formatMessage(LOG_LEVELS.ERROR, context, message));
    if (error) {
      console.error(error);
    }
  },
};

export default logger;
