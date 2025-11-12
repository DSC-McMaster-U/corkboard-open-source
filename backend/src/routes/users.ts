import express from "express";
import type { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { authService } from "../services/authService.js";

const router = express.Router();

// GET /api/users/ - Converts jwt token to user information
router.get(
    "/",
    authService.validateToken,
    async (req: Request, res: Response) => {
        let user = authService.getUser(res); // billy's note: this will get the first user from db ("name"="Test User")

        res.status(200).json({ user: user });
    }
);

// POST /api/users/
router.post("/", async (req: Request, res: Response) => {
    let { name = undefined, email = undefined } = req.body;

    if (name === "" || name === undefined) {
        res.status(412).json({ error: "Non-empty name is required" });
        return;
    }

    if (email === "" || email === undefined) {
        res.status(412).json({ error: "Non-empty email is required" });
        return;
    }

    userService
        .createUser(name, email)
        .then((user) => {
            res.status(200).json({ success: true, user });
        })
        .catch((err: Error) => {
            res.status(500).json({ error: err.message });
        });
});

export default router;
