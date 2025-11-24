/**
 * This is the database layer - isolates Supabase usage for team development
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// switch to Prisma ORM later if needed (later)
export const db = {
    events: {
        getAll: (
            limit: number,
            min_start_time: string,
            max_start_time: string,
            min_cost: number,
            max_cost: number
        ) =>
            supabase
                .from("events")
                .select("*")
                .gte("start_time", min_start_time)
                .lte("start_time", max_start_time)
                .gte("cost", min_cost)
                .lte("cost", max_cost)
                .limit(limit),
        add: (
            title: string,
            venue_id: string,
            start_time: string,
            description?: string | null,
            cost?: number | null,
            status?: "published" | "draft" | "hidden",
            source_type?: "manual" | string | null,
            source_url?: string | null,
            ingestion_status?: "success" | "failed" | "pending",
            artist?: string | null,
            image?: string | null
        ) =>    
            supabase.from("events").insert({
                title,
                venue_id,
                start_time,
                description,
                cost,
                status,
                source_type,
                source_url,
                ingestion_status,
                artist,
                image
            }),
    }
    
    venues: {
        getAll: (limit = 10) =>
            supabase.from("venues").select("*").limit(limit), // returns all venues
    },
    healthCheck: () => supabase.from("venues").select("count").limit(1), // returns the number of venues
};
