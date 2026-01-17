import { db } from "../db/supabaseClient.js";

export const bookmarkService = {
    getBookmarks: async (userId: string) => { // note: UUID use string
        const { data, error } = await db.bookmarks.getByUserId(userId);
        if (error) throw error;
        return data || [];
    },
    addBookmark: async (userId: string, eventId: string) => {
        const { data: event, error: eventError } = await db.events.getById(eventId);
        if (eventError || !event) {
            throw new Error("Event not found");
        }

        // check if already bookmarked - if so, return success (idempotent)
        const { data: existing } = await db.bookmarks.exists(userId, eventId);
        if (existing) {
            return existing; // Already bookmarked, return existing record
        }

        const { data, error } = await db.bookmarks.create(userId, eventId);
        if (error) throw error;
        return data;
    },
    removeBookmark: async (userId: string, eventId: string) => {
        // check if bookmark exists - if not, succeed silently (idempotent)
        const { data: existing } = await db.bookmarks.exists(userId, eventId);
        if (!existing) {
            return true; // Already removed or never existed, return success
        }

        const { error } = await db.bookmarks.delete(userId, eventId);
        if (error) throw error;
        return true;
    },
};
