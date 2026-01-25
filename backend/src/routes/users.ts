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
    },
);

// POST /api/users/
router.post("/", async (req: Request, res: Response) => {
    let {
        email = undefined,
        password = undefined,
        name = undefined,
        username = undefined,
        profile_picture = undefined,
        bio = undefined,
    } = req.body;

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
        .then(async (signUpRes) => {
            let signInResult = await userService.signInUser(email, password);

            // Endpoint still succeeds if this step fails, as having null information does not prevent user sign-in
            await userService
                .updateUser(
                    signUpRes.user?.id!,
                    name,
                    username,
                    profile_picture,
                    bio,
                )
                .catch((err) => {
                    console.warn("Error updating user information: ", err);
                });

            res.status(200).json({
                success: true,
                jwt: signInResult.session.access_token,
            });
        })
        .catch((err: Error) => {
            res.status(500).json({ success: false, error: err.message });
        });
});

export default router;
