import { db } from "../db/supabaseClient.js";

export const artistService = {
    getAllArtists: async (
        limit: number,
    ) => {
        const { data, error } = await db.artists.getAll(
            limit
        );
        if (error) throw error;
        return data ?? [];
    },

    getArtistById: async (
        artist_id: string,
    ) => {
        const { data, error } = await db.artists.getById(
            artist_id
        );
        if (error) throw error;
        return data ?? null;
    },

    getArtistByName: async (
        name: string,
    ) => {
        const { data, error } = await db.artists.getByName(
            name
        );
        if (error) throw error;
        return data ?? null;
    },

    createArtist: async (
        name: string,
        bio?: string,
        image?: string,
        created_at?: string
    ) => {
        const { data, error } = await db.artists.create({
            name: name,
            bio: bio,
            image: image,
            created_at: created_at,
        });
        if (error) throw error;
        return data;
    },

    addArtist: async (
        name: string,
        bio?: string | undefined,
        image?: string | undefined
    ) => {
        const created_date = new Date().toISOString();
        const { data, error } = await db.artists.add(
            name,
            bio,
            image,
            created_date
        );
        if (error) throw error;
        return data;
    },


    getOrCreateArtistByName: async (name: string) => {
        const clean = name.trim().replace(/\s+/g, " ");
        if (!clean) return null;

        const {data: existingArtist, error} = await db.artists.getByName(clean);
        if (error) throw error;

        // exists, return it
        if (existingArtist) {
            console.log(`Found existing artist: ${clean}`);
            return existingArtist;
        }

        // doesn't exist, create it and return
        const created = await artistService.addArtist(clean);
        console.log(`Created new artist: ${clean}`);
        return created;
    }
};
