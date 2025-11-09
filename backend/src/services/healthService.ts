import { db } from "../db/supabaseClient.js";

export const healthService = {
    checkDatabase: async () => {
        const { data, error } = await db.healthCheck();

        if (
            error &&
            error.message.includes('relation "public.venues" does not exist')
        ) {
            return {
                status: "ok",
                message: "API connected to Supabase",
                note: "Run migration to create tables",
            };
        }
        if (error) throw error;
        return {
            status: "ok",
            message: "API connected to Supabase",
            venuesCount: data?.length || 0,
        };
    },
};
