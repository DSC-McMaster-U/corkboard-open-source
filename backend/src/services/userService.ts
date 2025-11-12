import { db } from "../db/supabaseClient.js";
import type { Request, Response } from "express";

export const userService = {
    createUser: async (name: string, email: string) => {
        // Check if email already exists
        const { data: existing } = await db.users.getByEmail(email);
        if (existing) {
            throw new Error("Email already in use");
        }
        
        const { data, error } = await db.users.create(name, email);
        if (error) throw error;
        return data;
    },
    
    getUserById: async (userId: string) => {
        const { data, error } = await db.users.getById(userId);
        if (error) throw error;
        return data;
    },
};
