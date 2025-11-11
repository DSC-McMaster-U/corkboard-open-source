/**
 * This is the main entrypoint for the backend
 */

import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/events.js";
import venueRoutes from "./routes/venues.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import bookmarkRoutes from "./routes/bookmarks.js";

// Load environment variables
//dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
if (!process.env.TEST_ENV) {
    app.use(cors());
}

app.use(express.json());

// Main page
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Welcome to the Corkboard API",
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/bookmarks/", bookmarkRoutes);

if (!process.env.TEST_ENV) {
    app.listen(PORT, () => {
        console.log(`Corkboard API running on port ${PORT}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log(`Events: http://localhost:${PORT}/api/events`);
        console.log(`Venues: http://localhost:${PORT}/api/venues`);
        console.log(`Users: http://localhost:${PORT}/api/users`);
        console.log(`Bookmarks: http://localhost:${PORT}/api/bookmarks`);
    });
}

// Export to link with tests
export default app;
