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
        return data || [];
    },
    create: async (name: string) => {
        const { data, error } = await db.genres.create(name);
        if (error) throw error;
        return data ?? [];
    },
};
