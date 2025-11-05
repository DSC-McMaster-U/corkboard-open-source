import express from 'express';
import type { Request, Response } from 'express';
import { healthService } from '../services/healthService.js';

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    const health = await healthService.checkDatabase();
    res.json(health);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Supabase',
      error: error.message,
    });
  }
});

export default router;

