import { db } from "../db/supabaseClient.js";
import type { Request, Response } from "express";

export const authService = {
    validateToken: async (req: Request, res: Response, next: () => any) => {
        // TODO: Add validation with supabase auth
        if (req.header("Authorization") == "TESTING_BYPASS") {
            // fetch first user from database for testing
            const { data: user, error } = await db.users.getFirst();
            if (error || !user) {
                authService.setUser(res, undefined);
            } else {
                authService.setUser(res, { 
                    name: user.name || "Test User", 
                    id: user.id // UUID string
                });
            }
        } else {
            authService.setUser(res, undefined);
        }

        next();
    },
    refreshToken: async (token: string) => {
        throw new Error("authService.refreshToken is unimplemented");
    },
    authenticateUser: async () => {},
    setUser: (res: Response, user: any) => {
        res.locals.user = user;
    },
    getUser: (res: Response) => {
        return res.locals.user;
    },
};
