/**
 * This is the main entrypoint for the backend
 */

import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/events.js';
import venueRoutes from './routes/venues.js';
import healthRoutes from './routes/health.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Main page
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the Corkboard API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Corkboard API running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Events: http://localhost:${PORT}/api/events`);
  console.log(`Venues: http://localhost:${PORT}/api/venues`);
});
