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
        ) => {
            let query = supabase
                .from("events")
                .select(`
                    *,
                    venues (
                        id,
                        name,
                        address,
                        venue_type
                    )
                `)
                .gte("start_time", min_start_time)
                .lte("start_time", max_start_time);
            
            // handle NULL costs: only filter by cost if user specified a range
            const isDefaultCostRange = min_cost === 0 && max_cost === Number.MAX_VALUE;
            if (!isDefaultCostRange) {
                // apply cost range filter
                // billy's note: NULL costs will be excluded when filtering (standard behavior)
                query = query
                    .gte("cost", min_cost)
                    .lte("cost", max_cost);
            }
            
            return query.limit(limit);
        },
        
        // get events by id
        getById: (eventId: string) =>
            supabase
                .from("events")
                .select("*")
                .eq("id", eventId)
                .single(),
        
        // create event
        create: (eventData: {
            title: string;
            description?: string;
            venue_id: string;
            start_time: string;
            cost?: number;
            status?: string;
            source_type?: string;
            source_url?: string;
        }) =>
            supabase
                .from("events")
                .insert(eventData)
                .select()
                .single(),
    },
    venues: {
        getAll: (limit = 10) =>
            supabase.from("venues").select("*").limit(limit), // returns all venues
        
        // get venue by ID (helper for validation)
        getById: (venueId: string) =>
            supabase
                .from("venues")
                .select("*")
                .eq("id", venueId)
                .single(),
        
        // create venue
        // venue_type enum: "bar", "club", "theater", "venue", "outdoor", "other"
        // billy's note: `create_at` is auto-generated
        create: (venueData: {
            name: string;
            address?: string;
            venue_type?: string;
        }) =>
            supabase
                .from("venues")
                .insert(venueData)
                .select()
                .single(),
    },
    bookmarks: {
        // get all bookmarks for a user
        getByUserId: (userId: string) =>
            supabase // inner join with events and venues (nested relationship)
                .from("user_bookmarks")
                .select(`
                    *,
                    events (
                        id,
                        title,
                        description,
                        start_time,
                        cost,
                        status,
                        venues (
                            id,
                            name,
                            address,
                            venue_type
                        )
                    )
                `)
                .eq("user_id", userId)
                .order("created_at", { ascending: false }),
        
        // check if bookmark exists
        exists: (userId: string, eventId: string) =>
            supabase
                .from("user_bookmarks")
                .select("user_id, event_id")
                .eq("user_id", userId)
                .eq("event_id", eventId)
                .maybeSingle(),
        
        // add bookmark
        create: (userId: string, eventId: string) =>
            supabase
                .from("user_bookmarks")
                .insert({
                    user_id: userId,
                    event_id: eventId
                })
                .select()
                .single(),
        
        // remove bookmark
        delete: (userId: string, eventId: string) =>
            supabase
                .from("user_bookmarks")
                .delete()
                .eq("user_id", userId)
                .eq("event_id", eventId),
    },
    users: {
        // get first "real" user for testing (should be "name"="Test User")
        getFirst: () =>
            supabase
                .from("users")
                .select("*")
                .limit(1)
                .single(),
        
        // get user by ID
        getById: (userId: string) =>
            supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single(),
        
        // get user by email (for duplicate check)
        getByEmail: (email: string) =>
            supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .maybeSingle(),
        
        // create user
        create: (name: string, email: string) =>
            supabase
                .from("users")
                .insert({ name, email })
                .select()
                .single(),
    },
    healthCheck: () => supabase.from("venues").select("count").limit(1), // returns the number of venues
};
