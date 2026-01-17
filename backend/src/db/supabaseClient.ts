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
                    ),
                    artists (
                        id,
                        name,
                        bio,
                        image
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
                query = query.gte("cost", min_cost).lte("cost", max_cost);
            }

            return query.limit(limit);
        },

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
                ),
                artists (
                    id,
                    name,
                    bio,
                    image
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
            artist_id?: string | undefined;
        }) => supabase.from("events").insert(eventData).select().single(),

        // delete event by ID
        deleteById: (eventId: string) =>
            supabase.from("events").delete().eq("id", eventId),
    },
    venues: {
        getAll: (limit = 10) =>
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
                        ),
                        artists (
                            id,
                            name,
                            bio,
                            image
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

        // get user by ID with all favorites (genres, venues, artists)
        getByIdWithFavorites: (userId: string) =>
            supabase
                .from("users")
                .select(
                    `
                    *,
                    user_favorite_genres (
                        genre_id,
                        genres (
                            id,
                            name
                        )
                    ),
                    user_favorite_venues (
                        venue_id,
                        venues (
                            id,
                            name,
                            address,
                            venue_type
                        )
                    ),
                    user_favorite_artists (
                        artist_id,
                        artists (
                            id,
                            name,
                            bio,
                            image
                        )
                    )
                `
                )
                .eq("id", userId)
                .single(),

        // get user by username
        getByUsername: (username: string) =>
            supabase
                .from("users")
                .select("*")
                .eq("username", username)
                .maybeSingle(),

        // get user by email (for duplicate check)
        getByEmail: (email: string) =>
            supabase.from("users").select("*").eq("email", email).maybeSingle(),

        // create user
        create: (name: string, email: string) =>
            supabase.from("users").insert({ name, email }).select().single(),

        // update user profile
        updateProfile: (
            userId: string,
            updates: {
                username?: string;
                name?: string;
                profile_picture?: string;
                bio?: string;
            }
        ) =>
            supabase
                .from("users")
                .update(updates)
                .eq("id", userId)
                .select()
                .single(),

        // add favorite genre
        addFavoriteGenre: (userId: string, genreId: string) =>
            supabase
                .from("user_favorite_genres")
                .insert({ user_id: userId, genre_id: genreId })
                .select()
                .single(),

        // remove favorite genre
        removeFavoriteGenre: (userId: string, genreId: string) =>
            supabase
                .from("user_favorite_genres")
                .delete()
                .eq("user_id", userId)
                .eq("genre_id", genreId),

        // add favorite venue
        addFavoriteVenue: (userId: string, venueId: string) =>
            supabase
                .from("user_favorite_venues")
                .insert({ user_id: userId, venue_id: venueId })
                .select()
                .single(),

        // remove favorite venue
        removeFavoriteVenue: (userId: string, venueId: string) =>
            supabase
                .from("user_favorite_venues")
                .delete()
                .eq("user_id", userId)
                .eq("venue_id", venueId),

        // add favorite artist
        addFavoriteArtist: (userId: string, artistId: string) =>
            supabase
                .from("user_favorite_artists")
                .insert({ user_id: userId, artist_id: artistId })
                .select()
                .single(),

        // remove favorite artist
        removeFavoriteArtist: (userId: string, artistId: string) =>
            supabase
                .from("user_favorite_artists")
                .delete()
                .eq("user_id", userId)
                .eq("artist_id", artistId),
    },
    genres: {
        // get all genres
        getAll: () => supabase.from("genres").select("*"),

        // get genre by name (for duplicate check)
        getByName: (name: string) =>
            supabase.from("genres").select("*").eq("name", name).maybeSingle(),

        // create genre
        create: (name: string) =>
            supabase.from("genres").insert({ name }).select().single(),
    },
    artists: {
        // get all artists
        getAll: () => supabase.from("artists").select("*"),

        // get artist by name (for duplicate check)
        getByName: (name: string) =>
            supabase.from("artists").select("*").eq("name", name).maybeSingle(),

        // get artist by ID
        getById: (artistId: string) =>
            supabase.from("artists").select("*").eq("id", artistId).single(),

        // create artist
        create: (name: string, bio?: string, image?: string) =>
            supabase
                .from("artists")
                .insert({ name, bio, image })
                .select()
                .single(),
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
