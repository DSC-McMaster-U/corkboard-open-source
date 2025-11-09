import express from "express";
import type { Request, Response } from "express";
import { eventService } from "../services/eventService.js";

const router = express.Router();

// GET /api/events - Get all events
router.get("/", async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit
            ? parseInt(req.query.limit as string)
            : 10;
        const events = await eventService.getAllEvents(limit);
        res.json({ events, count: events.length });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Add more event routes here (POST, PUT, DELETE, ...)

export default router;
