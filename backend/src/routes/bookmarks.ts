import express from "express";
import type { Request, Response } from "express";
import { bookmarkService } from "../services/bookmarkService.js";
import { authService } from "../services/authService.js";

const router = express.Router();

// GET /api/bookmarks/ - Returns all of the bookmarks for a given user
router.get(
    "/",
    authService.validateToken,
    async (req: Request, res: Response) => {
        const user = authService.getUser(res);

        if (user == undefined) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        bookmarkService
            .getBookmarks(user.id)
            .then((result) => {
                res.status(200).json({ bookmarks: JSON.stringify(result) });
            })
            .catch((err) => {
                res.status(418).json({ error: err });
            });
    }
);

// POST /api/bookmarks/ - Adds a bookmark for a given event to a given user
router.post(
    "/",
    authService.validateToken,
    async (req: Request, res: Response) => {
        let user = authService.getUser(res);

        if (user == undefined) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { eventId = undefined } = req.body;

        if (eventId == undefined || eventId == 0) {
            res.status(412).json({ error: "Missing event ID" });
            return;
        }

        bookmarkService
            .addBookmark(user.id, parseInt(eventId))
            .then(() => {
                res.status(200).json({ success: true });
            })
            .catch((err) => {
                res.status(418).json({ error: err });
            });
    }
);

// DELETE /api/bookmarks/ - Removes a bookmark for a given event from a given user
router.delete(
    "/",
    authService.validateToken,
    async (req: Request, res: Response) => {
        const user = authService.getUser(res);

        if (user == undefined) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { eventId = undefined } = req.body;

        if (eventId == undefined) {
            res.status(412).json({ error: "Missing event ID" });
            return;
        }

        bookmarkService
            .removeBookmark(user.id, parseInt(eventId))
            .then(() => {
                res.status(200).json({ success: true });
            })
            .catch((err) => {
                res.status(418).json({ error: err });
            });
    }
);

export default router;
