import { db } from "../db/supabaseClient.js";

export const genresService = {
    getAll: async () => {
        const { data, error } = await db.genres.getAll();
        if (error) throw error;
        return data || [];
    },
    getByName: async (name: string) => {
        const { data, error } = await db.genres.getByName(name);
        if (error) throw error;
        return data; // If name is not found the data outputted should be undefined
    },
    create: async (name: string) => {
        const { data, error } = await db.genres.create(name);
        if (error) throw error;
        return data ?? [];
    },
};
