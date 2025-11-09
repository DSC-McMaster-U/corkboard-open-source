import express from 'express';
import type { Request, Response } from 'express';
import { venueService } from '../services/venueService.js';

const router = express.Router();

// GET /api/venues - Get all venues
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const venues = await venueService.getAllVenues(limit);
    res.json({ venues, count: venues.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add more venue routes here (POST, PUT, DELETE, etc.)

export default router;

