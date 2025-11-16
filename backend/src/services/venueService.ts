import { db } from "../db/supabaseClient.js";

export const venueService = {
    getAllVenues: async (limit = 10) => {
        const { data, error } = await db.venues.getAll(limit);
        if (error) throw error;
        return data || [];
    },
    createVenue: async (
        name: string,
        venue_type?: string,
        address?: string
    ) => {
        const { data, error } = await db.venues.create({
            name: name,
            venue_type: venue_type,
            address: address,
        });

        if (error) throw error;
        return data ?? [];
    },
    // Add more venue service methods here
};
