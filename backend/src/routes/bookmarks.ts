import express from "express";
import type { Request, Response } from "express";
import { bookmarkService } from "../services/bookmarkService.js";
import { authService } from "../services/authService.js";

const router = express.Router();

// GET /api/bookmarks/get - Returns all of the bookmarks for a given user
router.get(
    "/get",
    authService.validateToken,
    async (req: Request, res: Response) => {
        // TODO (AustinBray77)
    }
);

// POST /api/bookmarks/add - Adds a bookmark for a given event to a given user
router.post(
    "/add",
    authService.validateToken,
    async (req: Request, res: Response) => {
        // TODO (AustinBray77)
    }
);

// DELETE /api/bookmarks/remove - Removes a bookmark for a given event from a given user
router.post(
    "/remove",
    authService.validateToken,
    async (req: Request, res: Response) => {
        let user = undefined;

        let { eventIdStr } = req.params;

        let eventId = parseInt(eventIdStr ?? "");

        bookmarkService
            .removeBookmark(user!.id, eventId)
            .then(() => {
                res.status(500);
            })
            .catch((err) => {
                res.status(418).json({ message: err });
            });
    }
);

export default router;
