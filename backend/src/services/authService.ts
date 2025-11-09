import { db } from "../db/supabaseClient.js";
import type { Request, Response } from "express";

export const authService = {
    validateToken: async (req: Request, res: Response, next: () => any) => {
        // TODO: Add validation with supabase auth
        authService.setUser(res, {});

        res.status(404).json({
            message: "authService.validateToken is unimplemented",
        });
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
