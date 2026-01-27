import { db } from "../db/supabaseClient.js";
import { v4 as uuidv4 } from 'uuid';

type BucketType = 'events' | 'artists' | 'users';

export const imageService = {

    // upload image to Supabase storage and return public URL and filename
    uploadImage: async (
        bucket: BucketType,
        file: Express.Multer.File | File | Blob,
        id?: string // optional ID for the image
    ) => {
        
        const fileExtension = imageService.getFileExtension(file);
        if (!fileExtension) {
            throw new Error("File extension could not be determined from the provided file.");
        }

        const fileName = id ?
            `${id}.${fileExtension}` :
            `${uuidv4()}.${fileExtension}`;

        // convert Multer file to Buffer with proper content type
        let fileBody: Buffer | File | Blob;
        let uploadOptions: { contentType?: string; cacheControl?: string; upsert?: boolean } | undefined;

        if ('buffer' in file && 'mimetype' in file) { // Express.Multer.File 
            fileBody = file.buffer;
            uploadOptions = { contentType: file.mimetype };
        } else { // File or Blob
            fileBody = file as File | Blob;
            uploadOptions = undefined;
        }

        const { data, error } = await db.storage.upload(
            bucket, 
            fileName, 
            fileBody,
            uploadOptions
        );

        if (error) throw error;

        const { data: urlData } = await db.storage.getPublicUrl(bucket, fileName);
        return {
            url: urlData.publicUrl,
            filename: fileName
        };
    },

    // delete image from Supabase storage
    deleteImage: async (
        bucket: BucketType,
         imageUrlOrPath: string // URL or path of the image to delete
    ) => {
        // extract file path from URL if full URL is provided
        const filePath = imageService.extractFilePathFromUrl(bucket, imageUrlOrPath);

        if (!filePath) {
            throw new Error("File path could not be determined from the provided URL or path.");
        }

        const fileExists = await imageService.fileExists(bucket, filePath);
        if (!fileExists) {
            throw new Error(`File not found: ${filePath}`);
        }

        const { error } = await db.storage.delete(bucket, filePath);

        if (error) throw error;
    },

    // check if a file exists in storage
    fileExists: async (bucket: BucketType, filePath: string): Promise<boolean> => {
        try {
            // extract just the filename from the path
            const fileName = filePath.split('/').pop() || filePath;
            const directory = filePath.includes('/') ? filePath.substring(0, filePath.lastIndexOf('/')) : undefined;

            const { data, error } = await db.storage.list(bucket, directory);

            if (error) {
                return false;
            }

            return data?.some((file: { name: string }) => file.name === fileName) ?? false;
        } catch (err) {
            return false;
        }
    },

    /**
     * Extracts the file path from a URL or path string.
     * Example: https://<project-id>.supabase.co/storage/v1/object/public/events/event-123.jpg
     * Returns: events/event-123.jpg
     */
    extractFilePathFromUrl: (bucket: BucketType, url: string) : string => {
        if (!url.includes('http')) {
            return url;
        }

        const urlPattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)`);
        const match = url.match(urlPattern);

        if (!match || !match[1]) {
            throw new Error(`Invalid URL: ${url}`);
        }
        return match[1];
    },

    // get file extension from file
    getFileExtension: (file: Express.Multer.File | File | Blob): string => {
        if ('originalname' in file) { // Express.Multer.File
            return file.originalname.split('.').pop() || 'jpg';
        } else if ('name' in file) { // File
            return file.name.split('.').pop() || 'jpg';
        } else { // Blob
            return 'jpg'; // default to jpg
        }        
    },

    validateImage: (file: Express.Multer.File): void => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
        }

        if (file.size > maxSize) {
            throw new Error(`File too large. Maximum size: 5MB`);
        }
    },

    // get public URL for an image
    getPublicUrl: (bucket: BucketType, filePath: string): string => {
        const { data } = db.storage.getPublicUrl(bucket, filePath);
        return data.publicUrl;
    },

    /**
     * Replace an existing image (delete old, upload new with same filename base)
     * Optional query parameter: ?id=<id> - ID for the image (if not provided, a random UUID will be generated)
     */
    replaceImage: async (
        bucket: BucketType,
        filePath: string,
        file: Express.Multer.File | File | Blob,
        id?: string // optional ID for the image
    ) => {
        try {
            await imageService.deleteImage(bucket, filePath);
        } catch (err) {

            if (err instanceof Error && !err.message.includes("File not found")) {
                throw new Error("Specified image could not be deleted.");
            }
        }

        // extract the base filename to preserve the ID
        const fileId = filePath.split('.')[0];        
        const result = await imageService.uploadImage(bucket, file, id ? id : fileId);
        return result;
    },

}