import express from "express";
import type { Request, Response } from "express";
import { eventService } from "../services/eventService.js";

const router = express.Router();

// GET /api/events - Get all events matching given parameters
router.get("/", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const start_time_range = req.query.start_time_range
        ? new Date(req.query.start_time_range as string)
        : new Date("1970-1-1");

    const end_time_range = req.query.end_time_range
        ? new Date(req.query.end_time_range as string)
        : new Date("2999-1-1");

    const min_cost = req.query.min_cost
        ? parseFloat(req.query.min_cost as string)
        : 0;

    const max_cost = req.query.max_cost
        ? parseFloat(req.query.max_cost as string)
        : Number.MAX_VALUE;

    const latitude = req.query.latitude
        ? parseFloat(req.query.latitude as string)
        : 43.2636408; // Hamilton, ON

    const longitude = req.query.longitude
        ? parseFloat(req.query.longitude as string)
        : -79.9089415; // Hamilton, ON

    const radius = req.query.radius ? parseInt(req.query.radius as string) : 10;

    eventService
        .getAllEvents(limit)
        .then((events) => {
            res.status(200).json({ events: events, count: events.length });
        })
        .catch((err: Error) => {
            res.status(500).json({ error: err });
        });
});

// Add more event routes here (POST, PUT, DELETE, ...)

export default router;
