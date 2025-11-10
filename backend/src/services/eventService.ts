import { db } from "../db/supabaseClient.js";

export const eventService = {
    getAllEvents: async (
        limit: number,
        min_start_time: string,
        max_start_time: string,
        min_cost: number,
        max_cost: number
    ) => {
        const { data, error } = await db.events.getAll(
            limit,
            min_start_time,
            max_start_time,
            min_cost,
            max_cost
        );
        if (error) throw error;
        return data ?? [];
    },
    // Add more event service methods here
};
