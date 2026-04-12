/**
 * Vercel Serverless Function Entry Point
 * 
 * Exports the Express application as a Vercel serverless function.
 * Vercel automatically routes all incoming requests to this handler.
 * 
 * @module api/index
 */

import app from "../server.js";

export default app;
