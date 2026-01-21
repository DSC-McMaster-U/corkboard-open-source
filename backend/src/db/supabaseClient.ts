/**
 * This is the database layer - isolates Supabase usage for team development
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { get } from "http";

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
                .select(
                    `
                    *,
                    venues (
                        id,
                        name,
                        address,
                        venue_type,
                        latitude,
                        longitude
                    ),
                    event_genres (
                        genre_id,
                        genres (
                            id,
                            name
                        )
                    )
                `
                )
                .gte("start_time", min_start_time)
                .lte("start_time", max_start_time);

            // handle NULL costs: only filter by cost if user specified a range
            const isDefaultCostRange =
                min_cost === 0 && max_cost === Number.MAX_VALUE;
            if (!isDefaultCostRange) {
                // apply cost range filter
                // billy's note: NULL costs will be excluded when filtering (standard behavior)
                query = query.or(
                    `cost.is.null,and(cost.gte.${min_cost},cost.lte.${max_cost}))`
                );
            }

            return query.limit(limit);
        },
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
            artist_id?: string | null,
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
                artist_id,
                image,
            }),

        // get events by id
        getById: (eventId: string) =>
            supabase
                .from("events")
                .select(
                    `
                *,
                venues (
                    id,
                    name,
                    address,
                    venue_type,
                    latitude,
                    longitude
                ),
                event_genres (
                    genre_id,
                    genres (
                        id,
                        name
                    )
                )
            `
                )
                .eq("id", eventId)
                .single(),

        // create event
        create: (eventData: {
            title: string;
            description: string | undefined;
            venue_id: string;
            start_time: string;
            cost: number | undefined;
            status: string | undefined;
            source_type: string | undefined;
            source_url: string | undefined;
            image: string | undefined;
        }) => supabase.from("events").insert(eventData).select().single(),

        // delete event by ID
        deleteById: (eventId: string) =>
            supabase.from("events").delete().eq("id", eventId),

        getByVenueTimeTitle: (
            venue_id: string,
            min_start_time: string,
            max_start_time: string
        ) =>
            supabase
                .from("events")
                .select(
                    "id, venue_id, start_time, title, description, cost, source_url, artist_id, image, status, source_type, ingestion_status"
                )
                .eq("venue_id", venue_id)
                .gte("start_time", min_start_time)
                .lte("start_time", max_start_time),

        updateByID: (
            id: string,
            patch: {
                title?: string;
                venue_id?: string;
                start_time?: string;
                description?: string | null;
                cost?: number | null;
                status?: "published" | "draft" | "hidden";
                source_type?: "manual" | string | null;
                source_url?: string | null;
                ingestion_status?: "success" | "failed" | "pending";
                artist_id?: string | null;
                image?: string | null;
            }
        ) =>
            supabase
                .from("events")
                .update(patch)
                .eq("id", id)
                .select()
                .single(),

        deleteForVenue: (venueId: string) =>
            supabase.from("events").delete().eq("venue_id", venueId),
    },
    artists: {
        getAll: (limit = 50) =>
            supabase.from("artists").select("*").limit(limit),

        getById: (artistId: string) =>
            supabase.from("artists").select("*").eq("id", artistId).single(),

        getByName: (name: string) =>
            supabase.from("artists").select("*").eq("name", name).maybeSingle(),

        create: (artistData: {
            name: string;
            bio?: string | undefined;
            image?: string | undefined;
            created_at?: string | undefined;
        }) => supabase.from("artists").insert(artistData).select().single(),

        add: (
            name: string,
            bio?: string | undefined,
            image?: string | undefined,
            created_at?: string | undefined
        ) =>
            supabase
                .from("artists")
                .insert({
                    name,
                    bio,
                    image,
                    created_at,
                })
                .select()
                .single(),
    },
    venues: {
        getAll: (limit = 50) =>
            supabase.from("venues").select("*").limit(limit), // returns all venues

        // get venue by ID (helper for validation)
        getById: (venueId: string) =>
            supabase.from("venues").select("*").eq("id", venueId).single(),

        // create venue
        // venue_type enum: "bar", "club", "theater", "venue", "outdoor", "other"
        // billy's note: `create_at` is auto-generated
        create: (venueData: {
            name: string;
            address: string | undefined;
            venue_type: string | undefined;
            latitude: number | undefined;
            longitude: number | undefined;
        }) => supabase.from("venues").insert(venueData).select().single(),

        // deletes a venue, mainly used in test cases
        deleteById: (venueId: string) =>
            supabase.from("venues").delete().eq("id", venueId),
    },
    bookmarks: {
        // get all bookmarks for a user
        getByUserId: (userId: string) =>
            supabase // inner join with events and venues (nested relationship)
                .from("user_bookmarks")
                .select(
                    `
                    *,
                    events (
                        id,
                        title,
                        description,
                        start_time,
                        cost,
                        status,
                        image,
                        venues (
                            id,
                            name,
                            address,
                            venue_type,
                            latitude,
                            longitude
                        )
                    )
                `
                )
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
                    event_id: eventId,
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
        getFirst: () => supabase.from("users").select("*").limit(1).single(),

        // get user by ID
        getById: (userId: string) =>
            supabase.from("users").select("*").eq("id", userId).single(),

        // get user by email (for duplicate check)
        getByEmail: (email: string) =>
            supabase.from("users").select("*").eq("email", email).single(),

        /**
         * Creates a user directly in the users table
         * @deprecated Users should be created through a trigger on sign-up.
         * Should visit the idea of removing this function if it is not needed
         */
        create: (
            name: string,
            email: string,
            username: string | undefined,
            profile_picture: string | undefined,
            bio: string | undefined
        ) =>
            supabase
                .from("users")
                .insert({ name, email, username, profile_picture, bio })
                .select()
                .single(),
    },
    genres: {
        // get all genres
        getAll: () => supabase.from("genres").select("*"),

        // get genre by name
        getByName: (name: string) =>
            supabase.from("genres").select("*").eq("name", name).single(), // Changed to .single() from maybeSingle() for consistent erroring

        // create genre
        create: (name: string) =>
            supabase.from("genres").insert({ name }).select().single(),

        // delete genre by ID
        deleteById: (genreId: string) =>
            supabase.from("genres").delete().eq("id", genreId),
    },
    healthCheck: () => supabase.from("venues").select("count").limit(1), // returns the number of venues
    auth: {
        // validate JWT token with Supabase Auth
        validateJWT: (token: string) => supabase.auth.getUser(token),

        // sign up new user in Supabase Auth
        signUp: (email: string, password: string) =>
            supabase.auth.signUp({ email, password }),

        // sign in user and get JWT token
        signIn: (email: string, password: string) =>
            supabase.auth.signInWithPassword({ email, password }),

        // sign out user (optional, for future use)
        signOut: () => supabase.auth.signOut(),
    },
};
