import { db } from "../db/supabaseClient.js";
import type { Request, Response } from "express";

export const userService = {
    signUpUser: async (email: string, password: string) => {
        const { data, error } = await db.auth.signUp(email, password);

        if (error) throw error;
        return data;
    },

    getUserById: async (userId: string) => {
        const { data, error } = await db.users.getById(userId);
        if (error) throw error;
        return data;
    },
};
