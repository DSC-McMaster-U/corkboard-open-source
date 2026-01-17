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
    createEvent: async (
        title: string,
        venue_id: string,
        start_time: string,
        description?: string,
        cost?: number,
        status?: string,
        source_type?: string,
        source_url?: string,
        image?: string,
        artist_id?: string
    ) => {
        const { data, error } = await db.events.create({
            title: title,
            description: description,
            venue_id: venue_id,
            start_time: start_time,
            cost: cost,
            status: status,
            source_type: source_type,
            source_url: source_url,
            image: image,
            artist_id: artist_id,
        });

        if (error) throw error;
        return data;
    },
    // Add more event service methods here
};
