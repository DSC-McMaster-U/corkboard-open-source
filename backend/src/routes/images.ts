import express from "express";
import type { Request, Response } from "express";
import multer from "multer";
import { imageService } from "../services/imageService.js";

const router = express.Router();

// configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

/**
 * POST /api/images/:bucket - Upload an image to the specified bucket
 * Optional query parameter: ?id=<id> - ID for the image (if not provided, a random UUID will be generated)
 */
router.post("/:bucket", upload.single("image"), async (req: Request, res: Response) => {
    try {
        const { bucket } = req.params;
        const id = req.query.id;
        
        if (!bucket) {
            res.status(400).json({ error: "Bucket is required" });
            return;
        }
        
        if (!['events', 'artists', 'users'].includes(bucket)) {
            res.status(400).json({ error: "Invalid bucket name" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: "No image file provided" });
            return;
        }

        imageService.validateImage(req.file);
        const uploadResult = await imageService.uploadImage(
            bucket as 'events' | 'artists' | 'users',
            req.file,
            id as string | undefined // optional ID for the image
        );

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ 
            success: true, 
            url: uploadResult.url,
            filename: uploadResult.filename
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/images/:bucket/:filename - Get public URL or redirect to image
 * Returns JSON if ?format=json or Accept: application/json header is present
 * Otherwise redirects to Supabase public URL for direct image viewing
 */
router.get("/:bucket/:filename", async (req: Request, res: Response) => {
    try {
        const { bucket, filename } = req.params;
        const { format } = req.query;
        
        if (!bucket || !filename) {
            res.status(400).json({ error: "Bucket and filename are required" });
            return;
        }
        
        if (!['events', 'artists', 'users'].includes(bucket)) {
            res.status(400).json({ error: "Invalid bucket name" });
            return;
        }

        const publicUrl = imageService.getPublicUrl(
            bucket as 'events' | 'artists' | 'users', 
            filename
        );

        const isJsonRequest = format === 'json' || req.headers.accept?.includes('application/json');
        
        if (isJsonRequest) {
            res.status(200).json({ 
                success: true, 
                url: publicUrl 
            });
        } else {
            res.redirect(publicUrl);
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/images/:bucket/:filename - Delete an image by filename
router.delete("/:bucket/:filename", async (req: Request, res: Response) => {
    try {
        const { bucket, filename } = req.params;
        
        if (!bucket || !filename) {
            res.status(400).json({ error: "Bucket and filename are required" });
            return;
        }
        
        if (!['events', 'artists', 'users'].includes(bucket)) {
            res.status(400).json({ error: "Invalid bucket name" });
            return;
        }

        await imageService.deleteImage(
            bucket as 'events' | 'artists' | 'users',
            filename
        );

        res.status(200).json({ 
            success: true, 
            message: "Image deleted successfully" 
        });
    } catch (err: any) {
        // check if error is "File not found"
        if (err.message && err.message.includes("File not found")) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// DELETE /api/images - Delete image by URL (from request body)
router.delete("/", async (req: Request, res: Response) => {
    try {
        const { bucket, url } = req.body;
        
        if (!bucket || !url) {
            res.status(400).json({ error: "Bucket and URL are required" });
            return;
        }

        if (!['events', 'artists', 'users'].includes(bucket)) {
            res.status(400).json({ error: "Invalid bucket name" });
            return;
        }

        await imageService.deleteImage(
            bucket as 'events' | 'artists' | 'users',
            url
        );

        res.status(200).json({ 
            success: true, 
            message: "Image deleted successfully" 
        });
    } catch (err: any) {
        // check if error is "File not found"
        if (err.message && err.message.includes("File not found")) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// PUT /api/images/:bucket/:filename - Replace an existing image
/**
 * PUT /api/images/:bucket/:filename - Replace an existing image
 * Optional query parameter: ?id=<id> - ID for the image (if not provided, a random UUID will be generated)
 */
router.put("/:bucket/:filename", upload.single("image"), async (req: Request, res: Response) => {
    try {
        const { bucket, filename } = req.params;
        const id = req.query.id;
        
        if (!bucket || !filename) {
            res.status(400).json({ error: "Bucket and filename are required" });
            return;
        }
        
        if (!['events', 'artists', 'users'].includes(bucket)) {
            res.status(400).json({ error: "Invalid bucket name" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: "No image file provided" });
            return;
        }

        // validate that the file is an image
        imageService.validateImage(req.file);

        const bucketType = bucket as 'events' | 'artists' | 'users';
        const result = await imageService.replaceImage(
            bucketType,
            filename,
            req.file,
            id as string | undefined
        );

        res.status(200).json({ 
            success: true, 
            url: result.url,
            filename: result.filename
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;