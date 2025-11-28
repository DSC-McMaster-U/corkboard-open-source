import express from "express";
import type { Request, Response } from "express";
import { genresService } from "../services/genresService.js";

const router = express.Router();

// GET /api/genres - Get all genres
router.get("/", async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string | undefined;

        if (name) {
            const genre = await genresService.getByName(name);
            res.json({ genre: genre });
            return;
        }

        const genres = await genresService.getAll();
        res.json({ genres: genres, count: genres.length });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req: Request, res: Response) => {
    // Handle Input
    const { name = undefined } = req.body;

    if (name == undefined) {
        res.status(400).json({ error: "Name is missing" });
        return;
    }

    // Call Service
    genresService
        .create(name)
        .then((_) => {
            res.status(200).json({ success: true });
        })
        .catch((err: Error) => {
            console.log("Error creating genre: ", err);
            res.status(500).json({ success: false, error: err });
        });
});

export default router;
