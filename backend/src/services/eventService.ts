import { db } from "../db/supabaseClient.js";

export const eventService = {
    getAllEvents: async (limit = 10) => {
        const { data, error } = await db.events.getAll(limit);
        if (error) throw error;
        return data || [];
    },
    // Add more event service methods here
};
