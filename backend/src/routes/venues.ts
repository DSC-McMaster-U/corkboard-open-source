import express from "express";
import type { Request, Response } from "express";
import { venueService } from "../services/venueService.js";

const router = express.Router();

// GET /api/venues - Get all venues
router.get("/", async (req: Request, res: Response) => {
    try {
        const { venueId, limit } = req.query;

        if (venueId) {
            const venue = await venueService.getVenueById(venueId as string);
            return res.json({ venue });
        }

        const limitNum = limit ? parseInt(limit as string) : 10;
        const venues = await venueService.getAllVenues(limitNum);

        res.json({ venues, count: venues.length });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req: Request, res: Response) => {
    // Handle Input
    const {
        name = undefined,
        venue_type = undefined,
        address = undefined,
        latitude = undefined,
        longitude = undefined,
    } = req.body;

    if (name == undefined) {
        res.status(400).json({ error: "Name is missing" });
        return;
    }

    // Call Service
    venueService
        .createVenue(name, venue_type, address, latitude, longitude)
        .then((_) => {
            res.status(200).json({ success: true });
        })
        .catch((err: Error) => {
            console.log("Error creating venue: ", err);
            res.status(500).json({ success: false, error: err });
        });
});

// Add more venue routes here (POST, PUT, DELETE, etc.)

export default router;
