import { db } from "../db/supabaseClient.js";

export const bookmarkService = {
    getBookmarks: async (userId: number) => {
        //throw new Error("bookmarkService.getBookmarks is unimplemented");
    },
    addBookmark: async (userId: number, eventId: number) => {
        throw new Error("bookmarkService.addBookmark is unimplemented");
    },
    removeBookmark: async (userId: number, eventId: number) => {
        throw new Error("bookmarkService.removeBookmark is unimplemented");
    },
};
