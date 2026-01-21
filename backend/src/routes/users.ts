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
        const user = authService.getUser(res);

        // handled unauthorized user
        if (user == undefined) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        res.status(200).json({ user: user });
    }
);

// POST /api/users/
router.post("/", async (req: Request, res: Response) => {
    let { email = undefined, password = undefined } = req.body;

    if (email === "" || email === undefined) {
        res.status(400).json({ error: "Non-empty email is required" });
        return;
    }

    if (password === "" || password === undefined) {
        res.status(400).json({ error: "Non-empty password is required" });
        return;
    }

    userService
        .signUpUser(email, password)
        .then((authRes) => {
            res.status(200).json({
                success: true,
                jwt: authRes.session?.access_token,
            });
        })
        .catch((err: Error) => {
            res.status(500).json({ success: false, error: err.message });
        });
});

export default router;
