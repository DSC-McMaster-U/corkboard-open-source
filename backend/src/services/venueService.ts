import { db } from "../db/supabaseClient.js";

export const venueService = {
    getAllVenues: async (limit = 10) => {
        const { data, error } = await db.venues.getAll(limit);
        if (error) throw error;
        return data || [];
    },
    // Add more venue service methods here
};
