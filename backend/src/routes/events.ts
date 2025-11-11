import express from "express";
import type { Request, Response } from "express";
import { eventService } from "../services/eventService.js";
import { parseDateOr, parseFloatOr, parseIntOr } from "../utils/parser.js";

const router = express.Router();

// GET /api/events - Get all events matching given parameters
router.get("/", async (req: Request, res: Response) => {
    const limit = parseIntOr(req.query.limit as string | undefined, 10);

    const min_start_time = parseDateOr(
        req.query.min_start_time as string | undefined,
        new Date("1970-1-1")
    );

    const max_start_time = parseDateOr(
        req.query.max_start_time as string | undefined,
        new Date("2999-1-1")
    );

    const min_cost = parseFloatOr(req.query.min_cost as string | undefined, 0);

    const max_cost = parseFloatOr(
        req.query.max_cost as string | undefined,
        Number.MAX_VALUE
    );

    const latitude = parseFloatOr(
        req.query.latitude as string | undefined,
        43.2636408 // Hamilton, ON
    );

    const longitude = parseFloatOr(
        req.query.longitude as string | undefined,
        -79.9089415 // Hamilton, ON
    );

    const radius = parseIntOr(req.query.radius as string | undefined, 10);

    eventService
        .getAllEvents(
            limit,
            min_start_time.toISOString(),
            max_start_time.toISOString(),
            min_cost,
            max_cost
        )
        .then((events) => {
            res.status(200).json({ events: events, count: events.length });
        })
        .catch((err: Error) => {
            console.log("Error getting events: ", err);
            res.status(500).json({ error: err });
        });
});

// Add more event routes here (POST, PUT, DELETE, ...)

export default router;
