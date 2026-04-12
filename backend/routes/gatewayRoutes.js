import express from "express";
import APIKey from "../models/APIKey.js";
import Service from "../models/Service.js";
import Usage from "../models/Usage.js";
import User from "../models/User.js";

const router = express.Router();

router.all("/call", async (req, res) => {
    console.log("--- Gateway: Testing Generic Call ---");
    try {
        const apiKey = req.headers["x-api-key"] || req.query.key;
        if (!apiKey) {
            console.log("Error: Missing API Key");
            return res.status(401).json({ error: "Missing x-api-key header or key query parameter" });
        }

        // Find API key
        const keyDoc = await APIKey.findOne({ key: apiKey, isActive: true }).populate('user');
        if (!keyDoc) {
            console.log("Error: Invalid or Inactive Key ->", apiKey);
            return res.status(403).json({ error: "Invalid or inactive API Key" });
        }

        if (!keyDoc.user) {
            console.log("Error: Key found but has no user attached");
            return res.status(500).json({ error: "API Key logic error: No user attached. Try deleting and re-adding this key." });
        }

        let service;
        // If it's a service key (sk_...), find the specific service
        if (apiKey.startsWith("sk_")) {
            const prefixMatch = apiKey.match(/^sk_([a-z0-9]{3})_/);
            if (prefixMatch) {
                const prefix = prefixMatch[1];
                service = await Service.findOne({ 
                    name: { $regex: new RegExp(`^${prefix}`, "i") }, 
                    isActive: true 
                });
            }
        }

        // Fallback for non-SK keys: find first subscribed service
        if (!service && keyDoc.user.subscribedServices && keyDoc.user.subscribedServices.length > 0) {
            service = await Service.findById(keyDoc.user.subscribedServices[0]);
        }

        if (!service) {
            console.log("Error: No matching service found for key prefix or user subscriptions");
            return res.status(404).json({ error: "No active service found for this key. Please subscribe to a service first." });
        }

        // AUTO-SYNC RATE: If the key rate is wrong (e.g., $0.01) but service is $69, update it.
        if (keyDoc.rate !== service.baseRate) {
            console.log(`Auto-Sync: Updating key rate from $${keyDoc.rate} to $${service.baseRate}`);
            keyDoc.rate = service.baseRate;
            await keyDoc.save();
        }

        // Log Usage
        const today = new Date();
        today.setHours(today.getHours(), 0, 0, 0); // Start of current hour

        await Usage.findOneAndUpdate(
            { apiKey: keyDoc._id, date: today },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );

        console.log(`Success: Logged 1 request for ${service.name} using key ...${apiKey.slice(-4)}`);

        res.json({
            status: "success",
            service: service.name,
            timestamp: new Date().toISOString(),
            message: `Response from ${service.name}: Hello World!`,
            billedRate: `$${keyDoc.rate.toFixed(3)}`
        });

    } catch (err) {
        console.error("Gateway Call Error Log:", err);
        res.status(500).json({ error: "Gateway Server Error: " + err.message });
    }
});

router.all("/:serviceName", async (req, res) => {
    try {
        const apiKey = req.headers["x-api-key"] || req.query.key;
        if (!apiKey) {
            return res.status(401).json({ error: "Missing x-api-key header or key query parameter" });
        }

        // Find API key
        const keyDoc = await APIKey.findOne({ key: apiKey, isActive: true }).populate('user');
        if (!keyDoc) {
            return res.status(403).json({ error: "Invalid or inactive API Key" });
        }

        // Find Service by basic name matching
        const serviceNameQuery = req.params.serviceName.replace("-", " ");
        const service = await Service.findOne({ name: { $regex: new RegExp(serviceNameQuery, "i") }, isActive: true });

        if (!service) {
            return res.status(404).json({ error: "Service not found or inactive" });
        }

        // Check if the user has this subscribed service
        if (!keyDoc.user.subscribedServices.includes(service._id)) {
            return res.status(403).json({ error: "You are not subscribed to this service" });
        }

        // Check if the key used belongs to this subscription prefix
        const prefix = `sk_${service.name.substring(0,3).toLowerCase()}_`;
        if (!apiKey.startsWith(prefix)) {
            return res.status(403).json({ error: "This API Key is not valid for this specific service." });
        }

        // Log Usage
        const today = new Date();
        today.setHours(today.getHours(), 0, 0, 0); // Start of current hour

        await Usage.findOneAndUpdate(
            { apiKey: keyDoc._id, date: today },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );

        // Simulation response
        res.json({
            status: "success",
            service: service.name,
            timestamp: new Date().toISOString(),
            message: "Hello World. This is the simulated response from the API Gateway!",
            billedRate: `$${service.baseRate.toFixed(3)}`
        });

    } catch (err) {
        console.error("Gateway Error:", err);
        res.status(500).json({ error: "Gateway Server Error" });
    }
});

export default router;
