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
    },
    venues: {
        getAll: (limit = 10) =>
            supabase.from("venues").select("*").limit(limit), // returns all venues
    },
    healthCheck: () => supabase.from("venues").select("count").limit(1), // returns the number of venues
};
