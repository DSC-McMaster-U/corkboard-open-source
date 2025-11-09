import express from "express";
import type { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { authService } from "../services/authService.js";

const router = express.Router();

// GET /api/users/get - Converts jwt token to user information
router.get(
    "/get",
    authService.validateToken,
    async (req: Request, res: Response) => {
        let user = authService.getUser(res);

        res.status(200).json({ user: user });
    }
);

// POST /api/users/create
router.post("/create", async (req: Request, res: Response) => {
    let { name, email } = req.params;

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
        .then(() => {
            res.status(200);
        })
        .catch((err: Error) => {
            res.status(500).json({ error: err });
        });
});

export default router;
