import express from "express";
import crypto from "crypto";
import Service from "../models/Service.js";
import User from "../models/User.js";
import APIKey from "../models/APIKey.js";
import { protect, adminOnly, superAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// public/user: List all active services
router.get("/", async (req, res) => {
    try {
        const services = await Service.find({ isActive: true });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin/SuperAdmin: List ALL services
router.get("/all", protect(), adminOnly, async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin/SuperAdmin: Add Service
// Admin/SuperAdmin: Add Service
router.post("/", protect(), adminOnly, async (req, res) => {
    console.log("POST /api/services called with:", req.body);
    try {
        const { name, description, baseRate } = req.body;
        if (!name || !description || baseRate === undefined) {
            console.log("Missing fields:", { name, description, baseRate });
            return res.status(400).json({ message: "Please provide all fields" });
        }
        const service = await Service.create({ name, description, baseRate });
        console.log("Service created:", service);
        res.status(201).json(service);
    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin/SuperAdmin: Delete Service
router.delete("/:id", protect(), adminOnly, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: "Service deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin/SuperAdmin: Update Service
// Subscribe to a Service (User only)
router.post("/:id/subscribe", protect(), async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const user = await User.findById(req.user.id);

        if (user.subscribedServices.includes(service._id)) {
            return res.status(400).json({ message: "Already subscribed to this service" });
        }

        user.subscribedServices.push(service._id);
        await user.save();

        // Generate exclusive service key string
        const prefix = `sk_${service.name.substring(0,3).toLowerCase().replace(/[^a-z0-9]/g, '')}_`;
        const generatedKey = `${prefix}${crypto.randomBytes(16).toString("hex")}`;

        res.json({ 
            message: `Subscribed successfully!`, 
            subscribedServices: user.subscribedServices,
            generatedKey 
        });
    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Unsubscribe from a Service
router.post("/:id/unsubscribe", protect(), async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const user = await User.findById(req.user.id);

        user.subscribedServices = user.subscribedServices.filter(subId => subId.toString() !== service._id.toString());
        await user.save();

        // Destroy any active API Keys explicitly matching this service's generation logic
        const prefix = `sk_${service.name.substring(0,3).toLowerCase().replace(/[^a-z0-9]/g, '')}_`;
        await APIKey.deleteMany({ user: user._id, key: { $regex: `^${prefix}` } });

        res.json({ message: `Unsubscribed from ${service.name}. Connected credentials blocked.`, subscribedServices: user.subscribedServices });
    } catch (error) {
        console.error("Unsubscribe Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/:id", protect(), adminOnly, async (req, res) => {
    console.log(`PUT /services/${req.params.id} called with body:`, req.body);
    try {
        const { name, description, baseRate, isActive } = req.body;
        const service = await Service.findById(req.params.id);

        if (!service) {
            console.log("Service not found");
            return res.status(404).json({ message: "Service not found" });
        }

        service.name = name || service.name;
        service.description = description || service.description;
        service.baseRate = baseRate !== undefined ? baseRate : service.baseRate;
        service.isActive = isActive !== undefined ? isActive : service.isActive;

        await service.save();
        console.log("Service updated:", service);
        res.json(service);
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
