-- Migration 015
-- Date: January 26, 2026
-- Purpose: Convert relative image paths to full Supabase Storage URLs
-- Applied by: Billy
-- Status: Applied

DO $$
DECLARE
    supabase_project_id TEXT := 'dniawpahwcqtvcnaaexv';
    supabase_base_url TEXT;
BEGIN
    supabase_base_url := 'https://' || supabase_project_id || '.supabase.co/storage/v1/object/public/';

    -- update events.image column
    UPDATE events
    SET image = CASE
        -- skip NULL values
        WHEN image IS NULL THEN NULL
        
        -- if already a full URL (starts with http), leave it as is
        WHEN image LIKE 'http%' THEN image
        
        -- ensure path starts with /, then convert based on pattern
        ELSE CASE
            -- pattern: /images/events/filename.jpg or images/events/filename.jpg
            WHEN image LIKE '%/images/events/%' OR image LIKE 'images/events/%' THEN
                supabase_base_url || 'events/' || REGEXP_REPLACE(
                    image,
                    '^.*/images/events/',
                    ''
                )
            
            -- pattern: /images/artists/filename.jpg or images/artists/filename.jpg
            WHEN image LIKE '%/images/artists/%' OR image LIKE 'images/artists/%' THEN
                supabase_base_url || 'artists/' || REGEXP_REPLACE(
                    image,
                    '^.*/images/artists/',
                    ''
                )
            
            -- pattern: /images/users/filename.jpg or images/users/filename.jpg
            WHEN image LIKE '%/images/users/%' OR image LIKE 'images/users/%' THEN
                supabase_base_url || 'users/' || REGEXP_REPLACE(
                    image,
                    '^.*/images/users/',
                    ''
                )
        END
    END
    WHERE image IS NOT NULL AND image NOT LIKE 'http%';

END $$;
