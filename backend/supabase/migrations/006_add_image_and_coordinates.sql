-- Migration 006
-- Date: 2025-11-20
-- Purpose: Add image column to events table and latitude/longitude columns to venues table
-- Applied by: Billy
-- Status: Applied

-- Add image column to events table
-- Stores local file path string (e.g. "images/events/event-123.jpg")
-- Path format: relative to backend/public/ directory
-- Frontend will access via: http://localhost:3000/images/events/event-123.jpg
ALTER TABLE events
    ADD COLUMN image VARCHAR(255) NULL;

-- Add latitude and longitude columns to venues table
-- Stores geographic coordinates for venue location
-- Type: DECIMAL(10, 8) allows precision up to 8 decimal places (accurate to ~1.1mm)
-- NULL allowed for venues without coordinates (can be populated later)
ALTER TABLE venues
    ADD COLUMN latitude DECIMAL(10, 8) NULL,
    ADD COLUMN longitude DECIMAL(10, 8) NULL;


-- Add sample image data to existing events
-- Link "Local Band Night" event (at "The Casbah") to "the-casbah.jpg"
UPDATE events
SET image = 'images/events/the-casbah.jpg'
WHERE title = 'Local Band Night'
    AND venue_id = (SELECT id FROM venues WHERE name = 'The Casbah');

-- Link "Jazz Night" event (at "Club Absinthe") to "club-absinthe.jpg"
UPDATE events
SET image = 'images/events/club-absinthe.jpg'
WHERE title = 'Jazz Night'
    AND venue_id = (SELECT id FROM venues WHERE name = 'Club Absinthe');

