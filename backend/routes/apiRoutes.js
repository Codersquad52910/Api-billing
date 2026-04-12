import express from "express";
import crypto from "crypto";
import APIKey from "../models/APIKey.js";
import Service from "../models/Service.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate API Key
router.post("/generate", protect(), async (req, res) => {
    const key = crypto.randomBytes(32).toString("hex");
    const newKey = await APIKey.create({ key, user: req.user._id });

    await Notification.create({
        user: req.user._id,
        title: "API Key Generated",
        message: `A new system-generated API key ending in ...${key.slice(-4)} was created.`,
        type: "success"
    });

    res.json(newKey);
});

// Add User-provided API Key
router.post("/add", protect(), async (req, res) => {
    try {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({ message: "API key is required" });
        }
        
        // Check if key already exists
        const existingKey = await APIKey.findOne({ key });
        if (existingKey) {
            return res.status(400).json({ message: "This API key already exists in the system" });
        }

        let keyRate = 0.01; // Default rate
        
        // Detect Service Key (sk_...)
        if (key.startsWith("sk_")) {
            try {
                const prefixMatch = key.match(/^sk_([a-z0-9]{3})_/);
                if (prefixMatch) {
                    const prefix = prefixMatch[1];
                    // Find service that matches this 3-letter prefix
                    const service = await Service.findOne({ 
                        name: { $regex: new RegExp(`^${prefix}`, "i") } 
                    });
                    if (service) {
                        keyRate = service.baseRate;
                    }
                }
            } catch (err) {
                console.error("Error detecting key rate:", err);
            }
        }

        const newKey = await APIKey.create({ key, user: req.user._id, rate: keyRate });

        await Notification.create({
            user: req.user._id,
            title: "Custom API Key Added",
            message: `A custom API key ending in ...${key.slice(-4)} was securely added with a rate of $${keyRate}/req.`,
            type: "success"
        });

        res.status(201).json(newKey);
    } catch (error) {
        console.error("Error adding API Key:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get User API Keys
router.get("/", protect(), async (req, res) => {
    const keys = await APIKey.find({ user: req.user._id });
    res.json(keys);
});

// Delete API Key
router.delete("/:id", protect(), async (req, res) => {
    const deletedKey = await APIKey.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (deletedKey) {
        await Notification.create({
            user: req.user._id,
            title: "API Key Revoked",
            message: `An API key ending in ...${deletedKey.key.slice(-4)} has been revoked and removed.`,
            type: "warning"
        });
    }

    res.json({ message: "Key deleted" });
});

export default router;
