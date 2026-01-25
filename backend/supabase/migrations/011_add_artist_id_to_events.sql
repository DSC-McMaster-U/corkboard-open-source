-- Migration 011
-- Date: December 30, 2025
-- Purpose: Replace artist VARCHAR column with artist_id foreign key
-- Applied by: Billy
-- Status: Applied

-- Create artists if they don't exist
INSERT INTO artists (name)
SELECT DISTINCT artist
FROM events
WHERE artist IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Add artist_id column to events table (foreign key to artists)
ALTER TABLE events
    ADD COLUMN artist_id UUID REFERENCES artists(id) ON DELETE SET NULL;

UPDATE events e
SET artist_id = a.id
FROM artists a
WHERE e.artist = a.name
    AND e.artist IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_events_artist_id ON events(artist_id);

ALTER TABLE events
    DROP COLUMN artist;

