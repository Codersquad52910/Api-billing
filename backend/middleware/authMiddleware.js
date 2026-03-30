/**
 * Authentication Middleware
 * 
 * Provides JWT-based authentication and role-based authorization
 * middleware for protecting API routes. Supports three authorization
 * levels: user, admin, and super_admin.
 * 
 * Middleware Chain:
 * 1. protect() - Validates JWT token and attaches user to request
 * 2. adminOnly - Restricts access to admin and super_admin roles
 * 3. superAdminOnly - Restricts access to super_admin role only
 * 
 * @module middleware/authMiddleware
 * @requires jsonwebtoken
 */

import jwt from "jsonwebtoken";

/**
 * JWT authentication middleware factory.
 * 
 * Extracts the JWT from the Authorization header (Bearer scheme),
 * verifies it against the JWT_SECRET, and attaches the decoded
 * user payload to `req.user`.
 * 
 * Optionally accepts an array of allowed roles for inline
 * role-based access control.
 * 
 * @param {string[]} [roles=[]] - Optional array of allowed roles.
 *   If empty, any authenticated user is allowed.
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Allow any authenticated user
 * router.get("/profile", protect(), handler);
 * 
 * // Allow only super_admin
 * router.post("/create-admin", protect(["super_admin"]), handler);
 */
export const protect = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Standardize to req.user._id for routes
      req.user = { ...decoded, _id: decoded.id || decoded._id };
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(401).json({ message: "Invalid Token" });
    }
  };
};

/**
 * Admin authorization middleware.
 * 
 * Restricts route access to users with 'admin' or 'super_admin' roles.
 * Must be used after the protect() middleware in the middleware chain
 * to ensure req.user is populated.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "super_admin")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

/**
 * Super Admin authorization middleware.
 * 
 * Restricts route access exclusively to users with the 'super_admin' role.
 * Must be used after the protect() middleware in the middleware chain.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "super_admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as super admin" });
  }
};
