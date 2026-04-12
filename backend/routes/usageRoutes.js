import express from "express";
import Usage from "../models/Usage.js";
import APIKey from "../models/APIKey.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect(), async (req, res) => {
    const keys = await APIKey.find({ user: req.user._id });
    const keyIds = keys.map((k) => k._id);
    const usage = await Usage.find({ apiKey: { $in: keyIds } }).populate("apiKey");
    res.json(usage);
});

router.get("/stats", protect(), async (req, res) => {
    try {
        const { period = "Monthly", apiKeyId } = req.query;

        let keyIds = [];
        let activeKeyCount = 0;

        if (apiKeyId && apiKeyId !== "all") {
            const key = await APIKey.findOne({ _id: apiKeyId, user: req.user._id });
            if (key) {
                keyIds = [key._id];
                activeKeyCount = key.isActive ? 1 : 0;
            }
        } else {
            const keys = await APIKey.find({ user: req.user._id });
            keyIds = keys.map((k) => k._id);
            activeKeyCount = keys.filter((k) => k.isActive || true).length; // Since APIKey model doesn't explicitly guarantee isActive property exists across all versions, count all.
        }

        let startDate = new Date();
        if (period === "24H") {
            startDate.setHours(startDate.getHours() - 24);
        } else if (period === "Weekly") {
            startDate.setDate(startDate.getDate() - 7);
        } else { 
            startDate.setDate(startDate.getDate() - 30);
        }

        const usage = await Usage.find({ 
            apiKey: { $in: keyIds },
            date: { $gte: startDate }
        }).sort({ date: 1 }).populate("apiKey");

        let totalRequests = 0;
        let totalRevenue = 0;

        const salesData = {};
        
        // Initialize based on period
        if (period === "24H") {
            for (let i = 23; i >= 0; i--) {
                const d = new Date();
                d.setHours(d.getHours() - i, 0, 0, 0);
                const key = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                salesData[key] = { date: key, cost: 0, tokens: 0 };
            }
        } else if (period === "Weekly") {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = days[d.getDay()];
                salesData[key] = { date: key, cost: 0, tokens: 0 };
            }
        }

        usage.forEach((curr) => {
            if (!curr.apiKey) return;
            
            let groupKey;
            const logDate = new Date(curr.date);
            
            if (period === "24H") {
                groupKey = logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (period === "Weekly") {
                groupKey = logDate.toLocaleDateString([], { weekday: 'short' });
            } else {
                groupKey = logDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }

            const revenue = curr.count * (curr.apiKey.rate || 0.01);
            const tokens = curr.count;

            totalRequests += tokens;
            totalRevenue += revenue;

            if (!salesData[groupKey]) {
                salesData[groupKey] = { date: groupKey, cost: 0, tokens: 0 };
            }
            salesData[groupKey].cost += revenue;
            salesData[groupKey].tokens += tokens;
        });

        const chartData = Object.values(salesData).map(item => ({
            date: item.date,
            cost: Number(item.cost.toFixed(2)),
            tokens: item.tokens
        }));

        res.json({
            totalUsage: totalRequests,
            currentBill: totalRevenue.toFixed(2),
            activeKeys: activeKeyCount,
            chartData
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/region", protect(), async (req, res) => {
    try {
        const keys = await APIKey.find({ user: req.user._id });
        const keyIds = keys.map(k => k._id);

        const usage = await Usage.find({ apiKey: { $in: keyIds } });

        const regionStats = usage.reduce((acc, curr) => {
            const region = curr.country || "Unknown";
            if (!acc[region]) acc[region] = 0;
            acc[region] += curr.count;
            return acc;
        }, {});

        const data = Object.keys(regionStats).map(region => ({
            name: region,
            value: regionStats[region]
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
