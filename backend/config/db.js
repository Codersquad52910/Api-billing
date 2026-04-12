/**
 * Database Configuration Module
 * 
 * Establishes and manages the MongoDB connection using Mongoose ODM.
 * Reads the connection URI from environment variables to support
 * multiple deployment environments (development, staging, production).
 * 
 * @module config/db
 * @requires mongoose
 */

import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database.
 * 
 * Uses the MONGO_URI environment variable for the connection string.
 * This function should be called once during application startup
 * before any database operations are performed.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is successfully established
 * @throws {Error} Throws if the connection fails (e.g., invalid URI, network issues)
 * 
 * @example
 * import connectDB from "./config/db.js";
 * await connectDB();
 */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
};

export default connectDB;
