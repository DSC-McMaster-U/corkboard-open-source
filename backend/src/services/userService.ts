import { db } from "../db/supabaseClient.js";
import type { Request, Response } from "express";

export const userService = {
    createUser: async (name: string, email: string) => {
        throw new Error("userService.createUser is unimplemented");
    },
};
