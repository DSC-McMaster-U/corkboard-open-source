import { db } from "../db/supabaseClient.js";
import type { Request, Response } from "express";

export const authService = {
    validateToken: async (req: Request, res: Response, next: () => any) => {
        // TODO: Add validation with supabase auth
        if (req.header("Authorization") == "TESTING_BYPASS") {
            authService.setUser(res, { name: "BYPASS", id: 109410480 });
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
