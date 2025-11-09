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
        getAll: (limit = 10) =>
            supabase.from("events").select("*").limit(limit), // returns all events
    },
    venues: {
        getAll: (limit = 10) =>
            supabase.from("venues").select("*").limit(limit), // returns all venues
    },
    healthCheck: () => supabase.from("venues").select("count").limit(1), // returns the number of venues
};
