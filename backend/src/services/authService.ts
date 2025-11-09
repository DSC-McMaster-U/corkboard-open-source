import { db } from "../db/supabaseClient.js";
import type { Request, Response } from "express";

export const authService = {
    validateToken: async (req: Request, res: Response, next: () => any) => {
        // TODO (AustinBray77): Figure out how to pass decrypted user information into the next function
        res.status(404).json({
            message: "authService.validateToken is unimplemented",
        });
    },
    refreshToken: async (token: string) => {
        throw new Error("authService.refreshToken is unimplemented");
    },
    authenticateUser: async () => {},
};
